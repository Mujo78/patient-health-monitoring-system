import React from 'react'
import { HiOutlineIdentification, HiOutlineLockClosed } from "react-icons/hi2"
import { Link } from 'react-router-dom'
import Profile from '../../../components/Profile'

const DoctorProfile: React.FC = () => {

  return (
      <Profile>
          <Link to='.'  className='p-2 flex items-center hover:bg-gray-100'>
            <HiOutlineIdentification className='text-[20px]' />
            <span className='ml-3 text-sm'>Personal information</span>
          </Link>
          <Link to='security-page'  className='p-2 flex items-center hover:bg-gray-100'>
            <HiOutlineLockClosed className='text-[20px]' />
            <span className='ml-3 text-sm'>Security</span>
          </Link>
      </Profile>
  )
}

export default DoctorProfile