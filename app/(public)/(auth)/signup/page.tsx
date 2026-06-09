import SignUpForm from "./_components/SignUpForm";

const page = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-md">
        <SignUpForm />
      </div>
    </div>
  );
};

export default page;
