import { User } from "../../models/user.model";

type CreateUserPayloadType = {
  name: string;
  email: string;
  password: string;
  userType: "parker" | "owner" | "admin";
  avatar?: string;
};

export const authenticationServices = {
  findUserById: async (id: string) => {
    return await User.findById(id);
  },
  findUserByEmail: async (email: string) => {
    return await User.findOne({ email });
  },
  createNewUser: async (payload: CreateUserPayloadType) => {
    return await User.create(payload);
  },
  updateUserVerificationToken: async (userId: string, token: string) => {
    return await User.updateOne(
      { _id: userId },
      { $set: { "userVerification.verificationToken": token } }
    );
  },
  updateUserPassword: async (userId: string, hashedPassword: string) => {
    return await User.updateOne(
      { _id: userId },
      { $set: { password: hashedPassword } }
    );
  },
  verifyUser: async (userId: string) => {
    return await User.updateOne(
      { _id: userId },
      { $set: { "userVerification.isVerified": true } }
    );
  },
};
