import { EmailType } from "../../@types";
import { env } from "../../config";
import { authenticationServices } from "../../services";
import { asyncHandler, passwordUtils } from "../../utils";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { sendEmailToUserUsingGmail } from "../../config/email.config";
import { User } from "../../models/user.model";

export const authControllers = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, userType } = req.body;
    if (!name || !email || !password || !userType) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password && password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    const isUserAlreadyRegistered =
      await authenticationServices.findUserByEmail(email);
    if (isUserAlreadyRegistered) {
      return res.status(400).json({ message: "User already registered" });
    }

    if (userType !== "parker" && userType !== "owner" && userType !== "admin") {
      return res.status(400).json({ message: "Invalid user type" });
    }

    if (userType === "admin") {
      return res
        .status(400)
        .json({ message: "Admin user cannot be registered" });
    }

    const hashedPassword = await passwordUtils.hashPassword(password);

    if (!hashedPassword) {
      return res.status(500).json({ message: "Error hashing password" });
    }

    const payload = {
      name: name,
      email: email,
      password: hashedPassword,
      userType: userType,
      avatar: "https://cdn-icons-png.flaticon.com/128/3135/3135715.png",
    };
    const user = await authenticationServices.createNewUser(payload);
    if (user) {
      const verificationToken = jwt.sign({ userId: user._id }, env.JWT_SECRET, {
        expiresIn: "1d",
      });

      await authenticationServices.updateUserVerificationToken(
        String(user._id),
        verificationToken
      );

      await sendEmailToUserUsingGmail(
        email,
        EmailType.VERIFICATION,
        verificationToken
      );

      return res.status(201).json({
        message: "User registered successfully",
        userId: user._id,
      });
    }

    return res.status(500).json({ message: "Error creating user" });
  }),

  checkIsEmailVerified: asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params as { userId: string };
    if (!userId) {
      return res.status(401).json({ message: "User ID is required" });
    }
    const user = await authenticationServices.findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isDeleted) {
      return res.status(404).json({ message: "User account has been deleted" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "User is blocked" });
    }

    const isVerified = user.userVerification?.isVerified || false;
    if (isVerified) {
      return res.status(200).json({
        message: "Email is already verified",
        isVerified,
      });
    }
    return res.status(200).json({
      message: "Email is not verified",
      isVerified,
    });
  }),

  verifyToken: asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.params as { token: string };

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
      const user = await authenticationServices.findUserById(decoded.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.isBlocked) {
        return res
          .status(403)
          .json({ message: "User is blocked. Please contact support." });
      }

      if (user.isDeleted) {
        return res
          .status(404)
          .json({ message: "User account has been deleted" });
      }

      if (user.userVerification?.isVerified) {
        return res.status(200).json({ message: "Email already verified" });
      }

      if (user.userVerification?.verificationToken !== token) {
        return res
          .status(400)
          .json({ message: "Invalid or expired verification token" });
      }

      const updatedUser = await User.findByIdAndUpdate(
        decoded.userId,
        {
          $set: {
            "userVerification.isVerified": true,
            "userVerification.verificationToken": "",
          },
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
      if (
        error instanceof jwt.JsonWebTokenError ||
        error instanceof jwt.TokenExpiredError
      ) {
        return res
          .status(400)
          .json({ message: "Invalid or expired verification token" });
      }

      console.error("Error verifying email:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await authenticationServices.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordMatch = await passwordUtils.comparePassword(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.isBlocked) {
      return res
        .status(403)
        .json({ message: "User is blocked. Please contact support." });
    }

    if (user.isDeleted) {
      return res.status(404).json({ message: "User account has been deleted" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        userType: user.role,
      },
      env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(200).json({
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.role,
        avatar: user.avatar,
        isVerified: user.userVerification?.isVerified || false,
      },
    });
  }),

  forgotPassword: asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await authenticationServices.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isBlocked) {
      return res
        .status(403)
        .json({ message: "User is blocked. Please contact support." });
    }

    if (user.isDeleted) {
      return res.status(404).json({ message: "User account has been deleted" });
    }

    // Generate reset token (24 hour validity)
    const resetToken = jwt.sign(
      { userId: user._id, email: user.email },
      env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Update user with reset token
    await authenticationServices.updateUserVerificationToken(
      String(user._id),
      resetToken
    );

    // Send reset email
    try {
      await sendEmailToUserUsingGmail(
        email,
        EmailType.RESET_PASSWORD,
        resetToken
      );
      return res.status(200).json({
        message: "Password reset link sent to your email",
        code: "RESET_EMAIL_SENT",
      });
    } catch (error) {
      console.error("Error sending password reset email:", error);
      return res.status(500).json({
        message: "Failed to send password reset email. Please try again later.",
      });
    }
  }),

  resetPassword: asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token and new password are required" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, env.JWT_SECRET) as {
        userId: string;
        email: string;
      };

      // Find user with the token
      const user = await authenticationServices.findUserById(decoded.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.isBlocked) {
        return res
          .status(403)
          .json({ message: "User is blocked. Please contact support." });
      }

      if (user.isDeleted) {
        return res
          .status(404)
          .json({ message: "User account has been deleted" });
      }

      // Verify the token matches what's in the database
      if (user.userVerification?.verificationToken !== token) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      // Hash the new password
      const hashedPassword = await passwordUtils.hashPassword(newPassword);

      if (!hashedPassword) {
        return res.status(500).json({ message: "Error hashing password" });
      }

      // Update password and clear the verification token
      await authenticationServices.updateUserPassword(
        decoded.userId,
        hashedPassword
      );

      // Clear the verification token
      await authenticationServices.updateUserVerificationToken(
        decoded.userId,
        ""
      );

      return res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      if (
        error instanceof jwt.JsonWebTokenError ||
        error instanceof jwt.TokenExpiredError
      ) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
      console.error("Error resetting password:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    // Since we're using JWT tokens, server-side logout is minimal
    // The client should remove the token from storage

    // Optional: If implementing token blacklisting
    // const token = req.headers.authorization?.split(' ')[1];
    // if (token) {
    //   await authenticationServices.blacklistToken(token);
    // }

    return res.status(200).json({ message: "Logged out successfully" });
  }),

  verifyEmail: asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.params;

    if (!token) {
      return res
        .status(400)
        .json({ message: "Verification token is required" });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };

      // Find user with the token
      const user = await authenticationServices.findUserById(decoded.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.isBlocked) {
        return res
          .status(403)
          .json({ message: "User is blocked. Please contact support." });
      }

      if (user.isDeleted) {
        return res
          .status(404)
          .json({ message: "User account has been deleted" });
      }

      // Check if user is already verified
      if (user.userVerification?.isVerified) {
        return res.status(200).json({ message: "Email already verified" });
      }

      // Verify the token matches what's in the database
      if (user.userVerification?.verificationToken !== token) {
        return res
          .status(400)
          .json({ message: "Invalid or expired verification token" });
      }

      // Update user verification status
      await authenticationServices.verifyUser(decoded.userId);

      return res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
      if (
        error instanceof jwt.JsonWebTokenError ||
        error instanceof jwt.TokenExpiredError
      ) {
        return res
          .status(400)
          .json({ message: "Invalid or expired verification token" });
      }
      console.error("Error verifying email:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }),

  // New API to resend verification email
  resendVerificationEmail: asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await authenticationServices.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isBlocked) {
      return res
        .status(403)
        .json({ message: "User is blocked. Please contact support." });
    }

    if (user.isDeleted) {
      return res.status(404).json({ message: "User account has been deleted" });
    }

    // Check if already verified
    if (user.userVerification?.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Generate new verification token
    const verificationToken = jwt.sign({ userId: user._id }, env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Update verification token
    await authenticationServices.updateUserVerificationToken(
      String(user._id),
      verificationToken
    );

    // Send verification email
    try {
      await sendEmailToUserUsingGmail(email, EmailType.VERIFICATION);
      return res.status(200).json({
        message: "Verification email sent successfully",
        code: "EMAIL_SENT",
      });
    } catch (error) {
      console.error("Error sending verification email:", error);
      return res.status(500).json({
        message: "Failed to send verification email. Please try again later.",
      });
    }
  }),

  // API to check email verification status
  checkVerificationStatus: asyncHandler(async (req: Request, res: Response) => {
    // Get user ID from authenticated request
    const userId = req.user?.id; // Assuming you have middleware that sets req.user

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await authenticationServices.findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isBlocked) {
      return res
        .status(403)
        .json({ message: "User is blocked. Please contact support." });
    }

    if (user.isDeleted) {
      return res.status(404).json({ message: "User account has been deleted" });
    }

    return res.status(200).json({
      isVerified: user.userVerification?.isVerified || false,
    });
  }),
};
