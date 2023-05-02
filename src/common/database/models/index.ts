import { Sequelize } from 'sequelize-typescript';
import { User } from '@models/user.entity';
import { LiveStream } from '@models/live-stream.entity';
import { Music } from '@models/music.entity';

import  * as config  from '@config/sequelize.config.js';

const sequelize = new Sequelize(config[process.env.NODE_ENV || 'development']);

sequelize.addModels([
  User, 
  LiveStream, 
  Music,
]);

export default sequelize.models;