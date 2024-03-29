import React from "react";
import { Props } from "../LandingPage";
import { Button } from "flowbite-react";
import { useSelector } from "react-redux";
import { authUser } from "../../features/auth/authSlice";

const LoginInfo: React.FC<Props> = ({ setSignUp }) => {
  const { status } = useSelector(authUser);

  const goSignUp = () => {
    setSignUp((n) => !n);
  };
  return (
    <div className="flex flex-col gap-6 text-center text-white lg:!gap-10">
      <h1 className="text-4xl font-bold">New here?</h1>
      <p className="xxl:text-lg">Your health, your priority - sign up today!</p>
      <Button
        disabled={status === "loading"}
        color="gray"
        className="mx-auto w-full hover:!text-black xl:!w-1/2"
        onClick={goSignUp}
      >
        <p className="xxl:text-lg">Sign up</p>
      </Button>
    </div>
  );
};

export default LoginInfo;
