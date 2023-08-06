import React, {useEffect, useState} from 'react'
import { Label, TextInput } from 'flowbite-react';
import { useForm } from 'react-hook-form';
import {useSelector} from "react-redux"
import {useNavigate} from "react-router-dom"
import { useAppDispatch } from '../../app/hooks';
import { authUser, login, reset as resetAuth } from '../../features/auth/authSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginValidationSchema } from '../../validations/auth/loginValidation';
import {HiEnvelope, HiLockClosed} from "react-icons/hi2"

import ForgotPasswordModal from '../../components/ForgotPasswordModal';
import CustomButton from '../../components/CustomButton';
import Logo from '../../components/Logo';

type User = {
    email: string,
    password: string
}

const LoginForm: React.FC = () => {
    const [forgotPassword, setForgotPassword] = useState<boolean>(false)

    const navigate = useNavigate()
    const {register, handleSubmit, formState, reset} = useForm<User>({ resolver: yupResolver(loginValidationSchema)})
    const {errors} = formState

    const dispatch = useAppDispatch();
    const {accessUser, status, message} = useSelector(authUser)

    useEffect(() =>{
        if(accessUser !== null && status === 'idle'){
            navigate("/dashboard")
        }else{
            navigate("/")
        }
    }, [accessUser, status, navigate])
    
    
    const onSubmit = (data: User) => {
        console.log(data)
        dispatch(login(data))
    }

    const forgotPasswordShow = () =>{
        dispatch(resetAuth())
        setForgotPassword(true)
    }

    useEffect(() => {
        if(status === 'idle'){
            reset()
        }
    }, [status, reset])

    return (
        <div className='h-3/4 flex justify-between flex-col'>
            <div className='flex items-start justify-start'>
                <Logo />
            </div>
            <div>
                {forgotPassword && <ForgotPasswordModal forgotPassword={forgotPassword} setForgotPassword={setForgotPassword} />} 
                <>
                    <h1 className='text-5xl font-Poppins flex justify-center mb-12 font-bold'>
                        Log in to Your Account
                    </h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex mx-auto font-Poppins max-w-sm flex-col gap-4">
                    <div>
                        <div className="mb-2 block">
                        <Label
                            htmlFor="email"
                            value="Email"
                            />
                        </div>
                        <TextInput
                            {...register("email")}
                            id="email"
                            icon={HiEnvelope}
                            color={errors.email && "failure"}
                            placeholder="name@example.com"
                            type="email"
                            />
                            <div className='h-3 mt-1'>
                                {errors.email && <p className='text-red-600 text-xs'>{errors.email.message}</p>}
                            </div>
                    </div>
                    <div>
                        <div className="mb-2 block">
                        <Label
                            htmlFor="password"
                            value="Password"
                            />
                        </div>
                        <TextInput
                            {...register("password")}
                            color={errors.password && "failure"}
                            id="password"
                            icon={HiLockClosed}
                            type="password"
                            />
                        <div  className='h-4 flex justify-between mt-1'>
                            <p className='text-red-600 text-xs'>
                                {errors.password ? errors.password.message : forgotPassword ? "" : message ? message : ""}
                            </p>
                            <p className='text-xs underline cursor-pointer' onClick={forgotPasswordShow}>
                                Forgot password?
                            </p>
                        </div>
                    </div>
                    <CustomButton className='bg-blue-700 hover:!bg-blue-600 transition-colors duration-300' type="submit">
                        Log in
                    </CustomButton>
                    </form>
                </>
            </div>
        </div>
      )
}

export default LoginForm
