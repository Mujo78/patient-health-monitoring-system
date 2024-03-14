import React from "react";
import { Props } from "../LandingPage";
import { Button } from "flowbite-react";

const SignUpInfo: React.FC<Props> = ({ setSignUp }) => {
  const goLogin = () => {
    setSignUp((n) => !n);
  };
  return (
    <div className="flex flex-col py-5 lg:!py-0 gap-8 text-center text-white">
      <h1 className="text-4xl font-bold">Already have an account?</h1>
      <p className="xxl:text-lg">Step into a world of healing and care.</p>
      <Button
        color="gray"
        className="w-full xl:!w-1/2 mx-auto hover:!text-black"
        onClick={goLogin}
      >
        <p className="xxl:text-xl">Log in</p>
      </Button>
    </div>
  );
};

export default SignUpInfo;
