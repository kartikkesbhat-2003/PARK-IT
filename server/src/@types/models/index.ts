export type UserSchemaType = {
  name: string;
  email: string;
  password: string;
  userType: "parker" | "owner" | "admin";
  avatar: string | null;
  phone: string;
  userVerification: {
    isVerified: boolean;
    verificationToken: string;
  };
  isVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};
