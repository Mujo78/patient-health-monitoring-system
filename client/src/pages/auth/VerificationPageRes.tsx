import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authUser, reset } from "../../features/auth/authSlice";
import CustomButton from "../../components/UI/CustomButton";
import { useAppDispatch } from "../../app/hooks";
import CustomSpinner from "../../components/UI/CustomSpinner";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi2";

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
    <div className="flex flex-col justify-center gap-4 h-screen items-center">
      {status === "idle" ? (
        <div className="flex justify-center gap-4 items-center flex-col">
          <HiOutlineCheckCircle
            color="green"
            className="w-28 xxl:w-56 h-auto"
          />
          <h1 className="text-xl xxl:!text-3xl text-center font-bold">
            You have successfully verified your email address!
          </h1>
        </div>
      ) : (
        status === "failed" && (
          <div className="flex justify-center text-center gap-4 items-center flex-col">
            <HiOutlineXCircle color="red" className="w-28 xxl:!w-56 h-auto" />
            <h1 className="text-xl xxl:!text-3xl text-red-600 font-bold">
              {message}
            </h1>
            <p className="text-md xxl:text-2xl text-red-600">
              Please try again later!
            </p>
          </div>
        )
      )}
      <CustomButton onClick={goToLogin}>
        <p className="xxl:!text-2xl">{status === "idle" ? "Login" : "Home"}</p>
      </CustomButton>
    </div>
  );
};

export default VerificationPageRes;
