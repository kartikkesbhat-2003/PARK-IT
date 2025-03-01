const resetPasswordTemplate = (resetUrl) => {
    return `<!DOCTYPE html>
      <html>
      
      <head>
          <meta charset="UTF-8">
          <title>Reset Password Email</title>
          <style>
              body {
                  background-color: #f4f4f4;
                  font-family: Arial, sans-serif;
                  font-size: 16px;
                  line-height: 1.6;
                  color: #333333;
                  margin: 0;
                  padding: 0;
              }
              
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  text-align: center;
                  background-color: #ffffff;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
  
              .logo {
                  max-width: 150px;
                  margin-bottom: 20px;
              }
  
              .message {
                  font-size: 20px;
                  font-weight: bold;
                  margin-bottom: 20px;
                  color: #1a73e8;
              }
  
              .body {
                  font-size: 16px;
                  margin-bottom: 20px;
                  color: #555555;
              }
  
              .cta {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #1a73e8;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 5px;
                  font-size: 16px;
                  font-weight: bold;
                  margin-top: 20px;
              }
  
              .support {
                  font-size: 14px;
                  color: #777777;
                  margin-top: 20px;
              }
          </style>
      </head>
  
      <body>
          <div class="container">
              <a href="http://park-it-app.vercel.app">
                  <img class="logo" src="https://i.ibb.co/D4mJ7WY/parking-logo.png" alt="PARK-IT Logo">
              </a>
              <div class="message"> Reset Your Password </div>
              <div class="body">
                  <p>Dear User,</p>
                  <p>
                      We received a request to reset your password for your PARK-IT account. If you made this request, please click the button below to reset your password:
                  </p>
                  <a href="${resetUrl}" class="cta">Reset Password</a>
                  <p>
                      If you did not request this password reset, you can safely ignore this email. The link will expire in 30 minutes for security purposes.
                  </p>
              </div>
              <div class="support">
                  If you have any questions or need assistance, feel free to reach out to us at 
                  <a href="mailto:support@parkit.com">support@parkit.com</a>. We’re here to help!
              </div>
          </div>
      </body>
      </html>`;
  };
  
  module.exports = resetPasswordTemplate;
  