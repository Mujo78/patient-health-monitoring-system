import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authUser, reset } from "../../features/auth/authSlice";
import CustomButton from "../../components/UI/CustomButton";
import { useAppDispatch } from "../../app/hooks";
import CustomSpinner from "../../components/UI/CustomSpinner";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi2";
import Header from "../../components/UI/Header";

const VerificationPageRes: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status, message } = useSelector(authUser);

  const goToLogin = () => {
    dispatch(reset());
    navigate("/", { replace: true });
  };

  if (status === "loading") return <CustomSpinner fromTop={12} size="lg" />;

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      {status === "idle" ? (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <HiOutlineCheckCircle
            color="green"
            className="h-auto w-28 xxl:w-56"
          />
          <Header
            bold
            size={1}
            text="You have successfully verified your email address!"
          />
        </div>
      ) : (
        status === "failed" && (
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <HiOutlineXCircle color="red" className="h-auto w-28 xxl:!w-56" />
            <Header text={message} bold size={1} className="!text-red-600" />
            <p className="text-md text-red-600 xxl:text-2xl">
              Please try again later!
            </p>
          </div>
        )
      )}
      <CustomButton onClick={goToLogin}>
        <p className="xxl:!text-lg">{status === "idle" ? "Login" : "Home"}</p>
      </CustomButton>
    </div>
  );
};

export default VerificationPageRes;
