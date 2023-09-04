import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { Button, Label, Modal, Spinner, TextInput, ToggleSwitch } from 'flowbite-react'
import { useSelector } from 'react-redux'
import { updateUser, UpdateUserInterface, authUser, deactivateAccount, logout, reset } from '../../../features/auth/authSlice'
import { useAppDispatch } from '../../../app/hooks'
import CustomButton from '../../../components/CustomButton'
import ErrorMessage from '../../../components/ErrorMessage'
import { toast } from 'react-hot-toast'

const GeneralSettings: React.FC = () => {
  
    const {accessUser, status, message} = useSelector(authUser)
    const dispatch = useAppDispatch()
    const [notifications, setNotifications]= useState<boolean>(accessUser?.data.notification || true)
    const [email, setEmail] = useState<string>(accessUser?.data.email || "")
    const [deactivate, setDeactivate]= useState<boolean>(false)

    useEffect(() => {
        dispatch(reset())
    }, [dispatch])

    const handleChange = () => {
        setNotifications((n) => !n)
    }

    const updateUserAcc = () => {
        const userData: UpdateUserInterface = {}
        if(email !== accessUser?.data.email){
            userData.email = email
        }
        if(notifications !== accessUser?.data.notification){
            userData.notification = notifications
        }

        if(email !== accessUser?.data.email || notifications !== accessUser?.data.notification){
            dispatch(updateUser(userData)).then((action) => {
                if(typeof action.payload === 'object'){
                    toast.success('Account successfully updated')
                }
            })

        }
    }

    const closeModal = () => {
        if(deactivate) setDeactivate(false)
    }

    const handleOperation = () => {
        if(deactivate){
            const data: {active:boolean} = {active: false}
            dispatch(deactivateAccount(data))
            setDeactivate(false)
            dispatch(logout())
        }
    }


    return (
    <div className='flex flex-col h-full'>
        <Header text='General settings' />
        <div className='h-full py-5 flex flex-col gap-4'>
            {status === 'loading' ? 
                <div className='mx-auto my-auto justify-center items-center'>
                    <Spinner />
                </div>    
                :
                <>
                    <div>
                        <p className='flex justify-between'>
                            <span className='text-blue-700 font-semibold'>
                                Patient
                            </span>
                            <span className='font-bold'>
                                {accessUser?.info.first_name + " " + accessUser?.info.last_name}
                            </span>
                        </p>
                    </div>
                    <div className='flex items-center justify-between'>
                        <Label
                            className='text-xs'
                            htmlFor="email"
                            value="Your email"
                        />
                        <div className='flex flex-col w-3/5'>
                            <TextInput
                                id="email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                                type="email"
                            />
                            <div className='h-4'>
                                {status === 'failed' && <ErrorMessage text={message} size='xs' />}
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center mt-3 justify-between'>
                        <Label
                            className='text-xs'
                            htmlFor="notification"
                            value="Email notifications"
                        />
                        <ToggleSwitch
                            id="notification"
                            label=''
                            onChange={handleChange}
                            checked={notifications}
                            color='success'
                        />
                    </div>
                    <div className='flex items-center mt-3 justify-between'>
                        <Label
                            className='text-xs'
                            htmlFor="deactivate"
                            value="Deactivate my account"
                        />
                        <Button color='failure' id='deactivate' size='xs' onClick={() => setDeactivate(true)}>
                            Deactivate
                        </Button>
                    </div>
                </>}
        </div>
        <Footer variant={1}>
            <CustomButton size='sm' disabled={email === accessUser?.data.email && notifications === accessUser?.data.notification || status === 'loading' || email === ''} className='mt-3' onClick={updateUserAcc}>
                Save changes
            </CustomButton>
        </Footer>
        <Modal show={deactivate} position='top-center' className='font-Poppins' onClose={closeModal}>
        <Modal.Header>Deactivate my account</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
                <div>
                    <p className='font-semibold'>Are you sure, you want to deactivate your account?</p>
                    <span className='text-xs text-gray-500'>By deactivating your account, you need to know:</span>
                    <ol className='text-xs list-disc ml-10 text-gray-500'>
                        <li> All of your future appointments will be cancelled</li>
                        <li> You can always come back, just by login into your account</li>
                    </ol>
                </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color='failure' onClick={handleOperation}>Yes</Button>
          <Button color="gray" onClick={closeModal} >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default GeneralSettings