import React, { useEffect, useState } from "react";
import SignUpForm from "./auth/SignUpForm";
import LoginForm from "./auth/LoginForm";
import SignUpInfo from "./auth/SignUpInfo";
import LoginInfo from "./auth/LoginInfo";
import { useNavigate } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { authUser } from "../features/auth/authSlice";
import backgroundImage from "/background-vert.svg";

export type Props = {
  setSignUp: React.Dispatch<React.SetStateAction<boolean>>;
};

const LandingPage: React.FC = () => {
  const [signup, setSignUp] = useState<boolean>(false);
  const { accessUser } = useSelector(authUser, shallowEqual);
  const navigate = useNavigate();
  const route = accessUser?.data.role.toLowerCase();

  useEffect(() => {
    if (accessUser) {
      navigate(`/${route}/${accessUser.data._id}`);
    } else {
      navigate("/");
    }
  }, [accessUser, route, navigate]);

  return (
    <div className="flex h-screen w-full flex-col items-center text-start md:flex-row">
      <div
        className={`flex h-fit w-full flex-col p-3 md:!h-screen md:!w-3/4 md:p-0 ${
          signup
            ? "animate-slide-down md:!animate-slide-right"
            : "animate-slide-back-down md:!animate-slide-back-right"
        }`}
      >
        <div className="flex h-fit items-center justify-center md:!h-screen">
          {signup ? <SignUpForm /> : <LoginForm />}
        </div>
      </div>
      <div
        className={`relative flex h-full w-full flex-col items-center justify-center bg-cover md:!h-screen md:!w-1/4 ${
          signup
            ? "animate-slide-up md:!animate-slide-left"
            : "animate-slide-back-up md:!animate-slide-back-left"
        }`}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="z-10 flex w-full flex-col px-6">
          {signup ? (
            <SignUpInfo setSignUp={setSignUp} />
          ) : (
            <LoginInfo setSignUp={setSignUp} />
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
