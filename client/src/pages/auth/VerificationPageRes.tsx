import { Spinner } from "flowbite-react";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authUser, reset } from "../../features/auth/authSlice";
import CustomButton from "../../components/UI/CustomButton";
import img from "../../assets/check.png";
import { useAppDispatch } from "../../app/hooks";

const VerificationPageRes: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status, message } = useSelector(authUser);

  const goToLogin = () => {
    dispatch(reset());
    navigate("/", { replace: true });
  };

  if (status === "loading")
    return (
      <div className="h-screen flex justify-center items-center">
        {" "}
        <Spinner />{" "}
      </div>
    );

  if (status === "idle")
    return (
      <div className="flex flex-col justify-center h-screen items-center">
        <img src={img} className="mb-10" />
        <h1 className="font-Poppins text-3xl mb-10 font-bold">
          You have successfully verified your email address!
        </h1>
        <CustomButton onClick={goToLogin}>Login</CustomButton>
      </div>
    );
  if (status === "failed")
    return (
      <div className="flex flex-col gap-3 font-Poppins justify-center h-screen items-center">
        <h1 className="text-3xl mb-10 text-red-600 font-bold">{message}</h1>
        <p className="font-sm text-red-600">Please try again later!</p>
        <CustomButton onClick={goToLogin}>Login</CustomButton>
      </div>
    );
};

export default VerificationPageRes;
