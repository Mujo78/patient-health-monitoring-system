import React, { useEffect, useState } from "react";
import SignUpForm from "./auth/SignUpForm";
import LoginForm from "./auth/LoginForm";
import SignUpInfo from "./auth/SignUpInfo";
import LoginInfo from "./auth/LoginInfo";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { authUser } from "../features/auth/authSlice";

export type Props = {
  setSignUp: React.Dispatch<React.SetStateAction<boolean>>;
};

const LandingPage: React.FC = () => {
  const [signup, setSignUp] = useState<boolean>(false);
  const { accessUser } = useSelector(authUser);
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
    <div className="text-start w-full h-screen flex items-center">
      <div
        className={`w-3/4 h-screen flex flex-col ${
          signup ? "animate-slide-right" : "animate-slide-back-right"
        }`}
      >
        {signup ? (
          <div className="h-screen">
            <SignUpForm />
          </div>
        ) : (
          <div className="h-screen">
            <LoginForm />
          </div>
        )}
      </div>
      <div
        className={`bg-photo-vertical w-1/4 h-screen flex-col relative flex items-center justify-center ${
          signup ? "animate-slide-left" : " animate-slide-back-left"
        }`}
      >
        <img
          src="./background-vert.svg"
          className="absolute h-full"
          alt="Background"
        />
        <div className="w-full px-10 mx-5 flex flex-col z-10 justify-center">
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
