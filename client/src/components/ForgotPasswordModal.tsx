import React, { useEffect, useState } from 'react'
import {Button, Label, Modal, Tabs, TextInput } from 'flowbite-react';
import CustomButton from './UI/CustomButton';
import { HiEnvelope } from 'react-icons/hi2';
import { useAppDispatch } from '../app/hooks';
import forgotPasswordMethod from "../service/authSideFunctions"
import {reset } from '../features/auth/authSlice';

type Props = {
  forgotPassword: boolean,
  setForgotPassword: React.Dispatch<React.SetStateAction<boolean>>
}


const ForgotPassword: React.FC<Props> = ({forgotPassword, setForgotPassword}) => {

    const dispatch = useAppDispatch()
    const [email, setEmail] = useState<string>("")
    const [response, setResponse] = useState<string>("")

    useEffect(() =>{
      if(response.startsWith("Token")){
        setEmail("")
      }
    }, [response])

    const onClose = () => {
        dispatch(reset())
        setForgotPassword(false)
    }

    const handleClick = async (event: React.FormEvent) => {
        event.preventDefault()
        if(email !== ''){
          const res = await forgotPasswordMethod(email)
          setResponse(res)
        }
    }

    const onChange = (event : React.FormEvent<HTMLInputElement>) =>{
        const {value} = event.currentTarget;
    
        setEmail(value)
    }

  return (
    <Modal show={forgotPassword} className='font-Poppins' onClose={onClose}>
        <Modal.Header>Forgot Password</Modal.Header>
        <Modal.Body>
          <Tabs.Group>
          <Tabs.Item
          active
          title="Email verification"
      >
        <form onSubmit={handleClick} className='flex flex-col px-20 gap-6'>
          <p className='text-sm'>
            Enter the email address associated with your account and we'll send you a link to reset your password.
          </p>
          <div>
            <Label
              htmlFor='email'
              value='Email'
            />
            <TextInput
                id='email'
                name='email'
                value={email}
                onChange={onChange}
                icon={HiEnvelope}
                placeholder='name@example.com'
                type='email'
            />
            <div className='h-3'>
                {
                    response !== "" && <p className={`${response.startsWith("Token") ? 'text-green-600' : 'text-red-600'} text-xs mt-1`}>{response}</p>
                }
            </div>
          </div>
          <CustomButton type='submit'>
            Continue
          </CustomButton>
        </form>
      </Tabs.Item>
          </Tabs.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" className="ml-auto" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
  )
}

export default ForgotPassword
