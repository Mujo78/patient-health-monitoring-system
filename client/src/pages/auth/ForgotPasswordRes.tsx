import React from "react";
import { useSelector } from "react-redux";
import { authUser } from "../../features/auth/authSlice";
import CustomButton from "../../components/UI/CustomButton";
import { useNavigate } from "react-router-dom";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi2";
import CustomSpinner from "../../components/UI/CustomSpinner";

const ForgotPasswordRes: React.FC = () => {
  const { status, message } = useSelector(authUser);
  const navigate = useNavigate();

  const goToLoginPage = () => {
    navigate("/");
  };

  if (status === "loading") return <CustomSpinner fromTop={12} size="lg" />;

  return (
    <div className="h-screen flex justify-center items-center flex-col gap-4">
      {status === "idle" ? (
        <div className="flex justify-center gap-4 items-center flex-col">
          <HiOutlineCheckCircle
            color="green"
            className="w-28 xxl:!w-56 h-auto"
          />
          <p className="text-md xxl:!text-2xl text-center font-semibold">
            You have successfully restarted your pasword!
          </p>
        </div>
      ) : (
        status === "failed" && (
          <div className="flex justify-center gap-4 items-center flex-col">
            <HiOutlineXCircle color="red" className="w-28 xxl:!w-56 h-auto" />
            <p className="text-red-600 text-md xxl:!text-2xl font-semibold">
              {message}
            </p>
          </div>
        )
      )}
      <CustomButton onClick={goToLoginPage}>
        <p className="xxl:!text-2xl">
          {status === "idle" ? "Go to Login Page" : "Home Page"}
        </p>
      </CustomButton>
    </div>
  );
};

export default ForgotPasswordRes;
