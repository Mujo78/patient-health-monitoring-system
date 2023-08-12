import React from 'react'
import { Avatar, Sidebar } from 'flowbite-react'
import hospitalImage from "../assets/hospital-logo.jpg"
import { NavLink } from 'react-router-dom'

type Props = {
  children: React.ReactNode,
  color: string
}

const RootSidebar: React.FC<Props> = ({children, color}) => {
   
  return (
    <div className="w-fit h-screen">
      <Sidebar>
        <Sidebar.Items className={`h-full font-Poppins border-r-2 border-r-${color} flex flex-col justify`}>
          <Sidebar.ItemGroup>
            <Sidebar.Item as={NavLink}
              to="/dashboard"
            >
              <div>
                <Avatar img={hospitalImage} rounded size="lg" />
              </div>

            </Sidebar.Item>
            {children}
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
</div>
  )
}

export default RootSidebar