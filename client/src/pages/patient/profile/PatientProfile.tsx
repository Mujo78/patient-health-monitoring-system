import { Card } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import ProfileLayout from '../../../components/ProfileLayout'
import { useSelector } from 'react-redux'
import { authUser, updatePicture } from '../../../features/auth/authSlice'
import CustomImg from '../../../components/CustomImg'
import {HiOutlineCog6Tooth, HiOutlineCamera, HiOutlineIdentification, HiOutlineLockClosed} from "react-icons/hi2"
import { Link, Outlet } from 'react-router-dom'
import CustomButton from '../../../components/CustomButton'
import { useAppDispatch } from '../../../app/hooks'
import { formatDate } from '../../../service/appointmentSideFunctions'

const PatientProfile: React.FC = () => {

  const {accessUser, status} = useSelector(authUser)
  const dispatch = useAppDispatch()
  const [selectedImg, setSelectedImg] = useState<File>()
  const [img, setImg] = useState("")

  useEffect(() => {
    let objectURL: string;
    if(selectedImg){
      objectURL = URL.createObjectURL(selectedImg)
      setImg(objectURL)
    }

    return () => URL.revokeObjectURL(objectURL)
  }, [selectedImg])

  const updateProfilePicture = () => {
    if(selectedImg){
      dispatch(updatePicture(selectedImg))
    }
  }

  return (
    <ProfileLayout>
      <Card className='max-w-sm h-3/4 relative z-10'>
        <div className='flex'>
          <div className='relative rounded-lg mx-auto'>
            {selectedImg ? 
            <img src={img}  className='w-[170px]'/>
            :   
            <CustomImg url={accessUser?.data.photo} className='w-[170px]' />
          }
            <div className='absolute bottom-5 right-5 w-[35px] h-[30px]'>
              <label htmlFor="inputFile" className='bg-blue-700 flex justify-center items-center p-1 rounded-full border-2 border-blue-700 cursor-pointer'>
                <HiOutlineCamera className="w-4 h-6 text-white" />
              </label>
              <input type='file' accept="image/*" id='inputFile' name='selectedImg'
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                  setSelectedImg(e.target.files[0])
                  }}} className='hidden' />
            </div>
          </div>
          <hr/>
          </div>
          <div className='h-full flex flex-col gap-6 divide-y'>
            <p className='text-[10px] font-semibold w-[180px] break-words'>{accessUser?.data.email}</p>
            <ul>
              <Link to='.' className='p-2 flex items-center hover:bg-gray-100'>
                <HiOutlineCog6Tooth className='text-[20px]' />
                <span className='ml-3 text-sm'>General</span>
              </Link>
              <Link to='personal-info'  className='p-2 flex items-center hover:bg-gray-100'>
                <HiOutlineIdentification className='text-[20px]' />
                <span className='ml-3 text-sm'>Personal information</span>
              </Link>
              <Link to='security'  className='p-2 flex items-center hover:bg-gray-100'>
                <HiOutlineLockClosed className='text-[20px]' />
                <span className='ml-3 text-sm'>Security</span>
              </Link>
            </ul>
            <div>
              <p className='text-sm mt-1'>Joined</p>
              <p className='text-center'>{formatDate(accessUser?.data.createdAt as Date)}</p>
            </div>
          </div>
          {img !== '' && status !== 'idle' && <CustomButton onClick={updateProfilePicture}>
            Save changes
          </CustomButton>}
      </Card>
      <Card className='w-2/4 h-3/4 relative z-10'>
       <Outlet />
      </Card>
    </ProfileLayout>
  )
}

export default PatientProfile