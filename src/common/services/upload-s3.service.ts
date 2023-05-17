import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as sharp from 'sharp';
import { spawn } from 'child_process';
import * as ffmpeg from 'fluent-ffmpeg';
import * as stream from 'stream';
import * as fs from 'fs';
import * as path from 'path';
import { ASSET_STORAGE, ASSET_TYPE, BUCKET_ACL_TYPE, MESSAGE } from '@common/constants';
import { promisify } from 'util';
import { ffprobe } from 'fluent-ffmpeg';
import { brotliCompress } from 'zlib';
import { AWSBucketNameOptimizer } from '@common/common.util';
import { Readable } from 'stream';

@Injectable()
export class UploadToS3Service {
  private readonly s3: S3;
  private readonly cloudFrontDomain: string;
  private readonly cloudFrontDomainPublic: string;

  constructor(
  ) {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    this.cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN; // set the CloudFront domain name from environment variable
    this.cloudFrontDomainPublic = process.env.CLOUDFRONT_DOMAIN_PUBLIC;
  }
  
  async compressImage(buffer: Buffer): Promise<Buffer> {
    const compressedImage = await sharp(buffer)
      // .resize(500) // resize the image to 500px width (you can set your own dimensions)
      .jpeg({ quality: 80 }) // compress the image to 80% quality JPEG format
      .toBuffer(); // get the compressed image buffer

    return compressedImage;
  }

  async compressMusic(fileNameToUpload: string, buffer: Buffer): Promise<Buffer> {
    try {
      const compressedBuffer = await new Promise<Buffer>(async (resolve, reject) => {
        const rootDir = process.cwd();
        const tempDirPath = path.join(rootDir, ASSET_STORAGE.TEMP_DIR);
    
        if (!fs.existsSync(tempDirPath)) {
          fs.mkdirSync(tempDirPath, { recursive: true });
        }
    
        const inputFilePath = path.join(`${tempDirPath}`, fileNameToUpload);
        const outputFilePath = path.join(`${tempDirPath}`, `compressed-${fileNameToUpload}`);
    
        fs.writeFileSync(inputFilePath, buffer);
        const args = [
          '-i',
          inputFilePath,
          '-c:a',
          'libmp3lame',
          '-b:a',
          '32k',
          '-y',
          outputFilePath
        ];
        const ffmpegProcess = spawn('ffmpeg', args);
    
        ffmpegProcess.on('close', (code) => {
          if (code !== 0) {
            reject(new Error(`ffmpeg process exited with code ${code}`));
          } else {
            const compressedFile = fs.readFileSync(outputFilePath);
            fs.unlinkSync(inputFilePath);
            fs.unlinkSync(outputFilePath);
            resolve(compressedFile);
          }
        });
    
        ffmpegProcess.on('error', (err) => {
          fs.unlinkSync(inputFilePath);
          fs.unlinkSync(outputFilePath);
          reject(err);
        });
    
        ffmpegProcess.stderr.on('data', (data) => {
          console.error(`ffmpeg error: ${data}`);
        });
    
      });
    
      return compressedBuffer;
    } catch (error) {
      console.error(`Error occurred while compressing music: ${error}`);
      throw error;
    }
  }

  async compressVideo(fileNameToUpload: string, buffer: Buffer): Promise<Buffer> {
    const rootDir = process.cwd();
    const tempDirPath = path.join(rootDir, ASSET_STORAGE.TEMP_DIR);
  
    if (!fs.existsSync(tempDirPath)) {
      fs.mkdirSync(tempDirPath, { recursive: true });
    }
  
    const inputFilePath = path.join(tempDirPath, fileNameToUpload);
    const outputFilePath = path.join(tempDirPath, `compressed-${fileNameToUpload}`);
  
    fs.writeFileSync(inputFilePath, buffer);
  
    try {
      const ffprobeProcess = spawn('ffprobe', [
        '-v', 'error',
        '-show_entries', 'stream=width,height,codec_type,codec_name,bit_rate',
        '-of', 'json',
        inputFilePath
      ]);
  
      const chunks: Buffer[] = [];
      let error: Error;
  
      ffprobeProcess.stdout.on('data', (chunk) => {
        chunks.push(chunk);
      });
  
      ffprobeProcess.stderr.on('data', (chunk) => {
        console.error(`Error occurred while running FFprobe: ${chunk}`);
        error = new Error(chunk.toString());
      });
  
      const compressedBuffer = await new Promise<Buffer>((resolve, reject) => {
        ffprobeProcess.on('close', (code) => {
          if (code === 0 && !error) {
            const ffprobeOutput = Buffer.concat(chunks).toString();
            const metadata = JSON.parse(ffprobeOutput).streams[0];

            const videoBitrate = metadata.bit_rate / 2;
            // const videoBitrate = 500;
            const videoCodec = metadata.codec_name;
            const width = metadata.width;
            const height = metadata.height;
            const audioCodec = metadata.codec_type === "audio" ? metadata.codec_name : null;
            const audioBitrate = audioCodec ? metadata.bit_rate : null;

            const ffmpegProcess = spawn('ffmpeg', [
              '-i', inputFilePath,
              '-c:v', 'libx264',
              '-preset', 'slow',
              '-crf', '18',
              '-b:v', `${videoBitrate}`,
              '-bufsize', `2000k`,
              // '-maxrate', '700k',
              // '-vf', `scale=800:450`,
              '-vf', 'scale=trunc(oh*a/2)*2:720',
              '-y', outputFilePath
            ]);
            
            ffmpegProcess.on('close', (code) => {
              if (code === 0) {
                const compressedFile = fs.readFileSync(outputFilePath);
                fs.unlinkSync(inputFilePath);
                fs.unlinkSync(outputFilePath);
                resolve(compressedFile);
              } else {
                fs.unlinkSync(inputFilePath);
                fs.unlinkSync(outputFilePath);
                reject(new Error(`FFmpeg exited with code ${code}`));
              }
            });
          } else {
            fs.unlinkSync(inputFilePath);
            reject(error);
          }
        });
      });
  
      return compressedBuffer;
    } catch (error) {
      console.error(`Error occurred while compressing video: ${error}`);
      throw error;
    }
  }
  
  async uploadFileToBucket(
    file: Express.Multer.File, 
    type: ASSET_TYPE,
    needCompress: Boolean,
    bucketOption: any,
  ) {
    try {
      const fileNameToUpload = `${Date.now()}-${file.originalname}`;
      const compressedFileNameToUpload = `compressed-${fileNameToUpload}`;

      let willUploadFile: Buffer = file.buffer;
  
      // if (needCompress == true) {
      //   if (type == ASSET_TYPE.IMAGE) {
      //     willUploadFile = await this.compressImage(file.buffer);
      //   } else if (type == ASSET_TYPE.MUSIC) {
      //     try {
      //       willUploadFile = await this.compressMusic(fileNameToUpload, file.buffer);
      //     } catch (error) {
      //       throw new HttpException(MESSAGE.FAILED_TO_COMPRESS_MUSIC, HttpStatus.BAD_REQUEST);
      //     }
      //   } else if (type == ASSET_TYPE.VIDEO) {
      //     try {
      //       willUploadFile = await this.compressVideo(fileNameToUpload, file.buffer);
      //     } catch (error) {
      //       throw new HttpException(MESSAGE.FAILED_TO_COMPRESS_VIDEO, HttpStatus.BAD_REQUEST);
      //     }
      //   }
      // }
  
      const uploadFileParams = {
        Key: `${new AWSBucketNameOptimizer(bucketOption.targetBucket).getAwsOptimizedBucketPath()}/${needCompress ? compressedFileNameToUpload : fileNameToUpload}`,
        Bucket: bucketOption.bucketBase,
        Body: willUploadFile,
        ACL: bucketOption.acl,
      };
  
      const resultFile = await this.s3.upload(uploadFileParams).promise();
      
      const uploadedFileUrl = bucketOption.acl == BUCKET_ACL_TYPE.PRIVATE ? 
        `https://${this.cloudFrontDomain}/${resultFile.Key}` : 
        `https://${this.cloudFrontDomainPublic}/${resultFile.Key}`;

      return uploadedFileUrl;
    } catch (error) {
      throw new HttpException("Failed to upload file", HttpStatus.BAD_REQUEST);
    }
  }
}
