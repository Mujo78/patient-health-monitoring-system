import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { authUser } from "../../features/auth/authSlice";
import CustomButton from "../../components/UI/CustomButton";
import { useNavigate } from "react-router-dom";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi2";
import CustomSpinner from "../../components/UI/CustomSpinner";
import Header from "../../components/UI/Header";

const ForgotPasswordRes: React.FC = () => {
  const { status, message } = useSelector(authUser, shallowEqual);
  const navigate = useNavigate();

  const goToLoginPage = () => {
    navigate("/");
  };

  if (status === "loading") return <CustomSpinner fromTop={12} size="lg" />;

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      {status === "idle" ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <HiOutlineCheckCircle
            color="green"
            className="h-auto w-28 xxl:!w-56"
          />
          <Header
            text="You have successfully restarted your pasword!"
            size={1}
          />
        </div>
      ) : (
        status === "failed" && (
          <div className="flex flex-col items-center justify-center gap-4">
            <HiOutlineXCircle color="red" className="h-auto w-28 xxl:!w-56" />
            <Header text={message} size={1} className="!text-red-600" />
          </div>
        )
      )}
      <CustomButton onClick={goToLoginPage}>
        <p className="xxl:!text-lg">
          {status === "idle" ? "Go to Login Page" : "Home Page"}
        </p>
      </CustomButton>
    </div>
  );
};

export default ForgotPasswordRes;
