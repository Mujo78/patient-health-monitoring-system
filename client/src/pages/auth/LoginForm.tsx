import React, {useEffect} from 'react'
import { Button, Label, TextInput } from 'flowbite-react';
import { useForm } from 'react-hook-form';
import {useSelector} from "react-redux"
import {useNavigate} from "react-router-dom"
import { useAppDispatch } from '../../app/hooks';
import { authUser, login, reset } from '../../features/auth/authSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginValidationSchema } from '../../validations/auth/loginValidation';

type User = {
    email: string,
    password: string
}

const LoginForm: React.FC = () => {

    const navigate = useNavigate()
    const {register, handleSubmit, formState, reset, getValues} = useForm<User>({ resolver: yupResolver(loginValidationSchema)})
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

    return (
        <>
            <h1 className='text-5xl font-Poppins flex justify-center mb-12 font-bold'>
                Login to Your Account
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
                    color={errors.email && "failure"}
                    placeholder="name@example.com"
                    type="email"
                    />
                    <div className='h-4'>
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
               
                    type="password"
                    />
                <div  className='h-4'>
                    {errors.password && <p className='text-xs text-red-600'>{errors.password.message}</p>}
                </div>
            </div>
            <Button className='bg-blue-700 hover:!bg-blue-600 transition-colors duration-300' type="submit">
                Submit
            </Button>
            </form>
        </>
      )
}

export default LoginForm
