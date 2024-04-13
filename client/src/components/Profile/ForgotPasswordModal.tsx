import React, { useState } from "react";
import { Button, Modal, Tabs } from "flowbite-react";
import CustomButton from "../UI/CustomButton";
import { HiEnvelope } from "react-icons/hi2";
import { useAppDispatch } from "../../app/hooks";
import forgotPasswordMethod from "../../service/authSideFunctions";
import { reset } from "../../features/auth/authSlice";
import { forgotPasswordSchema } from "../../validations/auth/loginValidation";
import ErrorMessage from "../UI/ErrorMessage";
import Input from "../UI/Input";

type Props = {
  forgotPassword: boolean;
  setForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
};

const ForgotPassword: React.FC<Props> = ({
  forgotPassword,
  setForgotPassword,
}) => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [errors, setErrors] = useState<string>("");

  const onClose = () => {
    dispatch(reset());
    setForgotPassword(false);
  };

  const validateForm = async () => {
    try {
      await forgotPasswordSchema.validate({ email }, { abortEarly: false });
      return true;
    } catch (error: any) {
      const errors = error.message;
      setErrors(errors);
      return false;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors("");
    const isValid = await validateForm();

    if (isValid) {
      try {
        const res = await forgotPasswordMethod(email);
        setResponse(res);
        setEmail("");
      } catch (error: any) {
        setResponse(error?.response?.data ?? error?.message);
      }
    }
  };

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setEmail(value);
  };

  return (
    <Modal show={forgotPassword} className="font-Poppins" onClose={onClose}>
      <Modal.Header>Forgot Password</Modal.Header>
      <Modal.Body>
        <Tabs.Group>
          <Tabs.Item active title="Email verification">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 sm:px-20"
            >
              <p className="text-sm xxl:!text-xl">
                Enter the email address associated with your account and we'll
                send you a link to reset your password.
              </p>
              <div>
                <Input
                  autoComplete="true"
                  label="Email"
                  value={email}
                  onChange={onChange}
                  icon={HiEnvelope}
                  name="email"
                  id="email"
                  placeholder="name@example.com"
                >
                  <ErrorMessage
                    text={errors !== "" ? errors : response}
                    className={
                      response && response.startsWith("Token") && errors === ""
                        ? "!text-green-600"
                        : ""
                    }
                  />
                </Input>
              </div>
              <CustomButton type="submit">
                <p className="xxl:text-lg">Continue</p>
              </CustomButton>
            </form>
          </Tabs.Item>
        </Tabs.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button color="gray" className="ml-auto" onClick={onClose}>
          <p className="xxl:text-lg">Close</p>
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ForgotPassword;
