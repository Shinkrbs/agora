import { ForgotPasswordForm } from "./_components/ForgotPasswordForm";

const page = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-md">
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default page;
