import React from 'react'
import CustomButton from './CustomButton'
import { Spinner, Table } from 'flowbite-react'
import {HiOutlineXCircle, HiOutlineUserGroup} from "react-icons/hi2"
import { useSelector } from 'react-redux'
import { markAllAsRead, notification } from '../features/notification/notificationSlice'
import { useNavigate } from 'react-router-dom'
import ErrorMessage from './ErrorMessage'
import moment from 'moment'
import { useAppDispatch } from '../app/hooks'
import { authUser } from '../features/auth/authSlice'

type Props = {
    setShow: React.Dispatch<React.SetStateAction<boolean>>
}

const NavBarDropdown: React.FC<Props> = ({setShow}) => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch()
    const {personNotifications, status, message} = useSelector(notification)
    const readed = personNotifications?.some((value) => value.read === false)
    const {accessUser} = useSelector(authUser)
    let route = '';
    if(accessUser?.data.role === 'PATIENT') route = '/notifications'
    if(accessUser?.data.role === 'DOCTOR') route = '/doctor-notifications'
    if(accessUser?.data.role === 'PHARMACY') route = '/pharmacy-notifications'

    const markAll = () => {
        if(readed){
            dispatch(markAllAsRead())
        }
    }

    const navigateNotifications = () => {
        if(route !== ''){
            setShow(false)
            navigate(route)
        }
    }

    const handleNavigateNotification = (id: string) => {
        if(route !== ''){
            setShow(false)
            navigate(`${route}/${id}`)
        }
    }

    const oldOnes = personNotifications?.filter((n) => n.read === true).slice(personNotifications.length - 3, personNotifications.length).reverse()


  return (
    <div className='h-full flex flex-col overflow-y-auto'>
        <p className='px-3 pt-3 mb-2 flex text-[10px] justify-between items-center'>
            <span className='font-semibold'>Notifications</span>
            <button onClick={markAll} className='text-blue-700 underline'>Mark All as read</button>
        </p>
        <hr/>
        {personNotifications.length > 0 ?
        <>
            <Table className='rounded-none'>
                <Table.Body className='divide-y'>
                    {status === 'loading' ? 
                        <Table.Row>
                            <Table.Cell>
                                <Spinner />
                            </Table.Cell>
                        </Table.Row>
                    :
                    readed ?
                        personNotifications.map((n) => (
                            !n.read &&
                                <Table.Row onClick={() => handleNavigateNotification(n._id)} key={n._id} className={`cursor-pointer hover:!bg-gray-200 ${n.read ? 'bg-gray-100' : 'bg-white'} transition-colors duration-300`}>
                                <Table.Cell className='flex gap-2 items-center p-2'>
                                    {n.type === 'MESSAGE' ? <HiOutlineUserGroup className="h-[32px] w-[32px]" /> : <HiOutlineXCircle className="h-[32px] w-[32px] text-red-600" />}
                                    <div className='flex flex-col w-full text-xs'>
                                        <h3 className={`font-bold text-[10px] ${n.type === 'MESSAGE' ? 'text-blue-700' : 'text-red-600'}`}>{n.name}</h3>
                                        <div className='text-[9px] flex justify-between w-full'>
                                            <p className='w-3/4'>{n.content.slice(0, 120)}</p>
                                            <p className='mt-auto'>{moment(n.createdAt).format('hh:mm A')}</p>
                                        </div>
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        ))
                        : 
                        oldOnes.map((n) => (
                                <Table.Row onClick={() => handleNavigateNotification(n._id)} key={n._id} className={`cursor-pointer hover:!bg-gray-200 ${n.read ? 'bg-gray-100' : 'bg-white'} transition-colors duration-300`}>
                                <Table.Cell className='flex gap-2 items-center p-2'>
                                    {n.type === 'MESSAGE' ? <HiOutlineUserGroup className="h-[32px] w-[32px]" /> : <HiOutlineXCircle className="h-[32px] w-[32px] text-red-600" />}
                                    <div className='flex flex-col w-full text-xs'>
                                        <h3 className={`font-bold text-[10px] ${n.type === 'MESSAGE' ? 'text-blue-700' : 'text-red-600'}`}>{n.name}</h3>
                                        <div className='text-[9px] flex justify-between w-full'>
                                            <p className='w-3/4'>{n.content}</p>
                                            <p className='mt-auto'>{moment(n.createdAt).format('hh:mm A')}</p>
                                        </div>
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        ))
                    }
                </Table.Body>
            </Table>
            <CustomButton onClick={navigateNotifications} className="mt-auto w-full" size="xs">
                See all
            </CustomButton>
        </> :  <ErrorMessage text={message} /> }
    </div>
  )
}

export default NavBarDropdown