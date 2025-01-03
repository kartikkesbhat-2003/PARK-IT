const otpTemplate = (otp) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>OTP Verification Email</title>
        <style>
            body {
                background-color: #f4f4f4;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
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

            .highlight {
                font-weight: bold;
                font-size: 24px;
                color: #1a73e8;
            }
        </style>
    </head>

    <body>
        <div class="container">
            <a href="http://park-it-app.vercel.app">
                <img class="logo" src="https://i.ibb.co/D4mJ7WY/parking-logo.png" alt="PARK-IT Logo">
            </a>
            <div class="message"> OTP Verification for PARK-IT </div>
            <div class="body">
                <p> Dear User, </p>
                <p> 
                    Thank you for signing up with PARK-IT! To complete your registration, 
                    please use the following OTP (One-Time Password) to verify your account:
                </p>
                <h2 class="highlight">${otp}</h2>
                <p>
                    This OTP is valid for 5 minutes. If you did not request this verification, please ignore this email.
                    Once your account is verified, you will be able to enjoy hassle-free parking solutions with PARK-IT.
                </p>
            </div>
            <a href="http://park-it-app.vercel.app" class="cta">Visit PARK-IT</a>
            <div class="support"> If you have any questions or need assistance, feel free to reach out to us at 
                <a href="mailto:support@parkit.com">support@parkit.com</a>. We’re here to help!
            </div>
        </div>
    </body>
    </html>`;
};

module.exports = otpTemplate;
