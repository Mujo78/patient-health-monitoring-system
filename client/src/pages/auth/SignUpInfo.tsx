import React from "react";
import { Props } from "../LandingPage";
import { Button } from "flowbite-react";

const SignUpInfo: React.FC<Props> = ({ setSignUp }) => {
  const goLogin = () => {
    setSignUp((n) => !n);
  };
  return (
    <div className="flex flex-col gap-10">
      <h1 className=" text-white text-3xl font-bold text-center ">
        Already have an account?
      </h1>
      <p className="text-white">Step into a world of healing and care.</p>
      <Button
        color="gray"
        className="w-full hover:!text-black"
        onClick={goLogin}
      >
        Log in
      </Button>
    </div>
  );
};

export default SignUpInfo;
