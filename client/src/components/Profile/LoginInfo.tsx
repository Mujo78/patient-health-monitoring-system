import React from "react";
import { Props } from "../../pages/LandingPage";
import { Button } from "flowbite-react";
import { useSelector } from "react-redux";
import { authUser, reset } from "../../features/auth/authSlice";
import Header from "../UI/Header";
import { useAppDispatch } from "../../app/hooks";

const LoginInfo: React.FC<Props> = ({ setSignUp }) => {
  const { status } = useSelector(authUser);
  const dispatch = useAppDispatch();

  const goSignUp = () => {
    dispatch(reset());
    setSignUp((n) => !n);
  };
  return (
    <div className="flex flex-col gap-6 text-center text-white">
      <Header text="New here?" bold size={2} />
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
