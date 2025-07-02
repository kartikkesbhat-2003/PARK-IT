import { Mail } from "lucide-react";
const VerifyEmailPage = () => {
  return (
    <div className="w-full md:w-1/2 flex items-center justify-center p-8">
      <div className="flex flex-col gap-2 text-center items-center justify-center">
        <div className="w-10 h-10 border-2 border-blue-600 rounded-full flex items-center justify-center">
          <Mail className="text-blue-600" />
        </div>
        <h1 className="text-3xl font-semibold text-blue-600">Verify your email</h1>
        <p className="text-gray-500 w-full md:max-w-[400px]">
          We have sent a verification link to your email address. Please check
          your inbox and click the link to verify your email address.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
