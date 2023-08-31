import React from 'react'
import { Avatar, Sidebar } from 'flowbite-react'
import hospitalImage from "../assets/hospital-logo.jpg"
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { authUser } from '../features/auth/authSlice'

type Props = {
  children: React.ReactNode,
}

const RootSidebar: React.FC<Props> = ({children}) => {
  
  const {accessUser} = useSelector(authUser)

  const route = accessUser?.data.role.toLowerCase();

  return (
    <div className="w-fit h-screen">
      <Sidebar>
        <Sidebar.Items className={`h-full font-Poppins border-r-2 border-r-gray-200 flex flex-col justify`}>
          <Sidebar.ItemGroup>
            <Sidebar.Item as={NavLink}
              to={`/${route}/${accessUser?.data._id}`}
              >
              <div>
                <Avatar img={hospitalImage} rounded size="lg" />
              </div>

            </Sidebar.Item>
              <Sidebar.ItemGroup>
                {children}
              </Sidebar.ItemGroup>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
</div>
  )
}

export default RootSidebar