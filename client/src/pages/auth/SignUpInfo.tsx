import React from "react";
import { Props } from "../LandingPage";
import { Button } from "flowbite-react";
import Header from "../../components/UI/Header";
import { useSelector } from "react-redux";
import { authUser, reset } from "../../features/auth/authSlice";
import { useAppDispatch } from "../../app/hooks";

const SignUpInfo: React.FC<Props> = ({ setSignUp }) => {
  const { status } = useSelector(authUser);
  const dispatch = useAppDispatch();

  const goLogin = () => {
    dispatch(reset());
    setSignUp((n) => !n);
  };
  return (
    <div className="flex flex-col gap-8 py-5 text-center text-white lg:!py-0">
      <Header text="Already have an account?" size={2} normal bold />
      <p className="xxl:text-lg">Step into a world of healing and care.</p>
      <Button
        disabled={status === "loading"}
        color="gray"
        className="mx-auto w-full hover:!text-black xl:!w-1/2"
        onClick={goLogin}
      >
        <p className="xxl:text-xl">Log in</p>
      </Button>
    </div>
  );
};

export default SignUpInfo;
