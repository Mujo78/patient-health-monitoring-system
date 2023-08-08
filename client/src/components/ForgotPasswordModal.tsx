import React, { useEffect, useState } from 'react'
import {Button, Label, Modal, Tabs, TextInput } from 'flowbite-react';
import CustomButton from './CustomButton';
import { HiEnvelope } from 'react-icons/hi2';
import { useAppDispatch } from '../app/hooks';
import { useSelector } from 'react-redux';
import { authUser, forgotPassword as fPassword, reset } from '../features/auth/authSlice';

type Props = {
  forgotPassword: boolean,
  setForgotPassword: React.Dispatch<React.SetStateAction<boolean>>
}


const ForgotPassword: React.FC<Props> = ({forgotPassword, setForgotPassword}) => {

    const dispatch = useAppDispatch()
    const {message, status} = useSelector(authUser)
    const [email, setEmail] = useState<string>("")

    const onClose = () => {
        dispatch(reset())
        setForgotPassword(false)
    }

    const handleClick = (event: React.FormEvent) => {
        reset()
        event.preventDefault()
        if(email !== ''){
          dispatch(fPassword(email))
        }
        if(status === 'idle') setEmail("")
    }

    useEffect(() =>{
      if(status === 'idle'){
        setEmail("")
      }
    }, [dispatch, status])

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
                disabled={status === 'loading'}
                name='email'
                value={email}
                onChange={onChange}
                icon={HiEnvelope}
                placeholder='name@example.com'
                type='email'
            />
            {status !== 'loading' && <div className='h-3'>
                {
                    message !== "" && <p className={`${status === 'idle' ? 'text-green-600' : 'text-red-600'} text-xs mt-1`}>{message}</p>
                }
            </div>}
          </div>
          <CustomButton  disabled={status === 'loading'} type='submit'>
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
