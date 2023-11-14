import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { deleteAllNotifications, getPersonNotifications, markAllAsRead, notification } from '../features/notification/notificationSlice'
import { Table } from 'flowbite-react'
import ErrorMessage from '../components/UI/ErrorMessage'
import moment from 'moment'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../app/hooks'
import useSelectedPage from '../hooks/useSelectedPage'
import { colorPick } from '../service/authSideFunctions'

const Notifications: React.FC = () => {

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [selected, setSelected] = useState<string>("")
  const {personNotifications} = useSelector(notification)

  useSelectedPage("Notifications")

  const handleNavigate = (id: string) => {
    navigate(`${id}`)
    setSelected(id)
  }

  useEffect(() => {
    dispatch(getPersonNotifications())
  }, [dispatch])

  const toMark = personNotifications?.some((n) => n.read === false)

  const markAll = () => {
    if(toMark){
        dispatch(markAllAsRead())
    }
}

const deleteAll = () => {
    dispatch(deleteAllNotifications())
      navigate('../', {replace: true})
  }

  return (
    <div className='font-Poppins'>
    {personNotifications.length > 0 ?
      <div className='h-[90vh] flex divide-x'>
        <div className='h-full w-1/4 overflow-y-auto'>
          <Table className='overflow-y-auto'>
            <Table.Body className='divide-y overflow-y-auto'>
            {personNotifications.map((n) => (
              <Table.Row key={n._id} onClick={() => handleNavigate(n._id)} className={`cursor-pointer hover:!bg-gray-200 ${selected === n._id && '!bg-gray-200'}  ${n.read ? 'bg-gray-100' : 'bg-white'}` }>
                  <Table.Cell className='flex gap-2 items-center p-2'>
                    <div className='flex flex-col w-full text-xs'>
                      <h3 className={`font-bold text-[10px] ${colorPick(n.type)}`}>{n.name}</h3>
                      <div className='text-[9px] flex justify-between w-full'>
                        <p className='w-3/4'>{n.content.slice(0, 50)}</p>
                        <p className='mt-auto'>{moment(n.createdAt).format('hh:mm A')}</p>
                      </div>
                    </div>
                  </Table.Cell>
              </Table.Row>
            ))}
            </Table.Body>
          </Table>
        </div>
        <div className='flex w-full justify-between flex-col h-full items-center'>
        <div className='bg-blue-700 text-xs underline w-full flex items-center justify-between px-4 text-white h-[30px]'>
            <button onClick={markAll}>Make All As Read</button>
            <button onClick={deleteAll}>Delete All Notifications</button>
        </div>
              <Outlet />
        </div>
      </div>: <div className='flex justify-center mt-20'>
        <ErrorMessage text='There are no notifications.' size='md' />
      </div>}
    </div>
  )
}

export default Notifications