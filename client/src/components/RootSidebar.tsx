import React from 'react'
import { Avatar, Button, Sidebar } from 'flowbite-react'
import hospitalImage from "../assets/hospital-logo.jpg"
import { NavLink } from 'react-router-dom'
import { authUser, logout } from '../features/auth/authSlice'
import { useAppDispatch } from '../app/hooks'
import { useSelector } from 'react-redux'

type Props = {
  children: React.ReactNode
}

const RootSidebar: React.FC<Props> = ({children}) => {

  const dispatch = useAppDispatch()
  const {accessUser} = useSelector(authUser)
 
  let color;
  if(accessUser.data.role === "PATIENT"){
    color = "blue-700"
  }else if(accessUser.data.role === 'DOCTOR'){
    color = "gray-300"
  }else{
    color = "green-500"
  }
  
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

            <Button color="success" onClick={() => dispatch(logout())}>Logout</Button>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
</div>
  )
}

export default RootSidebar