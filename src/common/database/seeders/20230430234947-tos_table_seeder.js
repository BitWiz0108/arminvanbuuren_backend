'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('tos', [
      {
        content: `<p>Welcome to My Music Website. These terms and conditions outline the rules and regulations for the use of our website.
          By accessing this website, we assume you accept these terms and conditions in full. If you disagree with these terms
          and conditions, you must not use this website.</p>
        
          <h2>Intellectual Property</h2>
          <p>All content on this website, including text, graphics, logos, images, audio clips, and software, is the property of
            My Music Website or its content suppliers and is protected by United States and international copyright laws.</p>
          
          <h2>Disclaimer</h2>
          <p>This website is provided on an "as is" and "as available" basis. My Music Website makes no representations or
            warranties of any kind, express or implied, as to the operation of this website or the information, content,
            materials, or products included on this website. You expressly agree that your use of this website is at your sole
            risk.</p>
          
          <h2>Limitation of Liability</h2>
          <p>In no event shall My Music Website, its directors, officers, employees, or agents be liable to you or any third party
            for any damages arising out of the use of, or inability to use, this website, including but not limited to, damages
            for loss of profits, goodwill, or data.</p>
          
          <h2>Indemnification</h2>
          <p>You agree to indemnify and hold harmless My Music Website, its directors, officers, employees, and agents from any
            and all claims, damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from your use
            of this website or your breach of these terms and conditions.</p>
          
          <h2>Changes to the Terms of Service</h2>
          <p>My Music Website reserves the right to modify these terms and conditions at any time without prior notice. By using
            this website after any such modification, you agree to be bound by the modified terms and conditions.</p>
          
          <h2>Contact Us</h2>
          <p>If you have any questions about these terms and conditions, please contact us</p>
          </body>`,
      }
      
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('tos', null, {});
  }
};
