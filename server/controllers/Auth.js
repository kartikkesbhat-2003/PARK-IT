const User = require('../models/User')
const OTP = require('../models/OTP')
const bcrypt = require('bcrypt')
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const mailSender = require('../utils/mailSender');
require('dotenv').config();
// const { passwordUpdated } = require('../mail/templates/passwordUpdate');

// sendOtp
exports.sendotp = async (req, res) => {

    try {
        // fetch email from req body
        const {email} = req.body;

        // validate email
        if(!email) {
            return res.status(400).json(
                {
                    success:false,
                    message:"Please provide email"
                }
            )
        }

        // check if user allready exists
        const existingUser = await User.findOne({email});

        // if allready exists
        if(existingUser) {
            return res.status(400).json(
                {
                    success:false,
                    message:"User with mail id allready exists"
                }
            )
        }

        // generate otp
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        })

        console.log("Generated otp -> ", otp);

        // check unique otp or not
        const result = await OTP.findOne({otp:otp});
        
        while(result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlpahbets: false,
            });
        }

        // save otp in database
        const otpResponse = await OTP.create(
            {
                email,
                otp,
            }
        )

        // return response
        res.status(200).json(
            {
                success:true,
                message:"OTP is sent successfully",
                otp,
            }
        )


    } catch(err) {
        console.log(err);
        res.status(500).json(
            {
                success:false,
                messagae:"Error in generating OTP",
                error : err.messagae,
            }
        )
    }
}


// signup
exports.signup = async (req, res) => {
    try {
        // fetch data from req body 
        const {
            fullName,
            email, 
            password, 
            confirmPassword, 
            accountType = 'User',
            otp,
            status = "Unverified"
        } = req.body;

        // validate all the info 
        if(!fullName || 
            !email || 
            !password || 
            !confirmPassword || 
            !otp) {
            return res.status(403).json(
                {
                    success:false,
                    message:"Please fill all the details"
                }
            )
        }

        // check both the passwords are same or not
        if(password != confirmPassword) {
            return res.status(400).json(
                {
                    success:false,
                    message:"Password does not match"
                }
            )
        }

        // check if user allready exists
        const existingUser = await User.findOne({email});

        // if allready exists
        if(existingUser) {
            return res.status(400).json(
                {
                    success:false,
                    message:"User with mail id allready exists"
                }
            )
        }

        // find most recenet otp
        const response = await OTP.find({email}).sort({createdAt: -1}).limit(1);
        console.log('Response: ', response);

        //validate OTP
        if(response.length === 0) {
            //OTP not found
            return res.status(400).json({
                success: false,
                message: 'We could not find the OTP. Please try again',
                response
            });
        } else if ( otp !== response[0].otp) {
            //Invalid OTP
            return res.status(400).json({
                success: false,
                message: 'The OTP is not valid',
            });
        }

        // hash password
        const hashedPass = await bcrypt.hash(password, 10);

        // create entry in Database
        const user = await User.create(
            {
                fullName,
                email,
                accountType : accountType,
                password:hashedPass,
                status,
                image:`https://api.dicebear.com/5.x/initials/svg?seed=${fullName}`,
            }
        )

        // return response
        
        res.status(200).json(
            {
                success:true,
                message:"User is registered successfully",
                user,
            }
        )


    } catch(err) {
        console.log(err)
        return res.status(400).json(
            {
                success:false,
                message:"User cannot be registered. Please try again" ,
                error:err.messagae,
            }
        )

    }
}


// login
exports.login = async (req, res) => {
    try {
        // get data from request body
        const {email, password} = req.body;
        
        // validate
        if(!email || !password) {
            return res.status(403).json(
                {
                    success:false,
                    message:"All feilds are required"
                }
            )
        }

        // check user exist or not
        const user = await User.findOne({email})

        // if user allready exists
        if(!user) {
            return res.status(401).json(
                {
                    success:false,
                    message:`User is not registered with Us, Please signup to Continue`,
                }
            )
        }

        // generate JWT after passwrd matching
        if(await bcrypt.compare(password, user.password)) {

            const payload = {
                email:user.email,
                id:user._id,
                accountType:user.accountType,
                status: user.status
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn:"2h",
            })

            user.token = token;
            user.password = undefined;

            const options = {
                expires:new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true
            }

            // create cookie and send response
            res.cookie("token", token, options)
            .status(200)
            .json(
                {
                    success:true,
                    token,
                    user,
                    message:"Logged in successfully"
                }
            )
        }

        else {
            res.status(401).json(
                {
                    success:false,
                    message:"Wrong password"
                }
            )
        }
        
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Login Failure. Please try again",
            error:err.message,
        })
    }
}


// // change password
// exports.changePassword = async (req, res) => {
//     try {

//         const userDetails = await User.findById(req.user.id);
//         // fetch data
//         const {oldPassword, newPassword} = req.body;

//         //Validate old password
//         const isPasswordMatch = await bcrypt.compare(
//             oldPassword, 
//             userDetails.password
//         );

//         // get oldPassword, newPassword
//         if(!isPasswordMatch) {
//             return res
//                 .status(401)
//                 .json({
//                 success: false,
//                 message: 'The Password is Incorrect',
//             })
//         }

//         const encryptedPassword = await bcrypt.hash(newPassword, 10);
//         const updatedUserDetails = await User.findByIdAndUpdate(
//             req.user.id,
//             { password: encryptedPassword },
//             { new: true }
//         );

//         //send notification email
//         try {
//             const emailResponse = await mailSender(
//                 updatedUserDetails.email,
//                 `Password Updated Successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`,
//                 passwordUpdated(
//                     updatedUserDetails.email,
//                     updatedUserDetails.firstName,
//                 )
//             )
//             console.log('Email sent successfully................', emailResponse);
//         } catch (error) {
//             //if there's an error sending the email, log the error and return a 500 (Internal Server Error) error
//             console.log('Error Occurred While Sending Email: ', error);
//             return res.status(500).json({
//                 success: false,
//                 message: 'Error Occurred While Sending Email',
//                 error: error.message,
//             });
//         }

//         //Return success response
//         return res
//             .status(200)
//             .json
//             (
//                 { 
//                 success: true, 
//                 message: 'Password Updated Successfully' 
//             }
//         );

//     } catch(err) {
//         console.log(err);
//         return res.status(500).json({
//             success:false,
//             message:"Error while changing password",
//             error:err.message,
//         })
//     }
// }