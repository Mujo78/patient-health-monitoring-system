import React, { useEffect } from "react";
import CustomButton from "../../components/UI/CustomButton";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { shallowEqual, useSelector } from "react-redux";
import {
  authUser,
  reset,
  verifyEmailAddress,
} from "../../features/auth/authSlice";
import Logo from "../../components/UI/Logo";
import CustomSpinner from "../../components/UI/CustomSpinner";
import Header from "../../components/UI/Header";

const VerificationPage: React.FC = () => {
  const { verificationToken } = useParams();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { status } = useSelector(authUser, shallowEqual);

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  const verifyMyEmail = () => {
    if (verificationToken) {
      dispatch(verifyEmailAddress(verificationToken));
      navigate("/api/v1/user/verify-result", { replace: true });
    }
  };

  if (status === "loading") return <CustomSpinner size="lg" />;

  return (
    <div>
      <div className="flex h-screen flex-col items-center justify-center gap-4 text-center font-Poppins">
        <Logo />
        <Header text="Email verification" size={3} bold />
        <p className="xxl:text-xl">
          Please click the button below to verify your email address!
        </p>
        <CustomButton onClick={verifyMyEmail}>
          <p className="xxl:text-lg">Verify Email</p>
        </CustomButton>
      </div>
    </div>
  );
};

export default VerificationPage;
