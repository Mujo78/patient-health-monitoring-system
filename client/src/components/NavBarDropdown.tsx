import React from 'react'
import CustomButton from './CustomButton'

const NavBarDropdown: React.FC = () => {
  return (
    <div className='h-full flex flex-col'>
        <p className='px-3 pt-3 flex text-[10px] justify-between items-center'>
            <span>Notifications</span>
            <span>(Number)</span>
        </p>
        <hr/>
        <CustomButton className="mt-auto w-full" size="xs">
            See all
        </CustomButton>
    </div>
  )
}

export default NavBarDropdown