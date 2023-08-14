import React, { useEffect, useState } from 'react'
import CustomButton from '../../../components/CustomButton'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const AppointmentLayout: React.FC = () => {

    const navigate = useNavigate();
    const [newApp, setNewApp] = useState<boolean>(false)
    const location = useLocation()

    useEffect(() =>{
        if(location.pathname.startsWith("appointment/new")){
            setNewApp(true)
            navigate(location.pathname, {replace: true})
            console.log(location.pathname)
        }
        console.log(location.pathname)
    }, [location, navigate])

    const makeNewAppointment = () => {
        navigate("new", {replace: true})
        setNewApp(true)
    }

    

  return (
    <>
        {newApp || location.pathname === '/appointment/new' ? <Outlet /> :
            <div className='mx-auto my-auto'>
                <CustomButton onClick={makeNewAppointment}>
                    Make appointment
                </CustomButton>
            </div>
        }
    </>
  )
}

export default AppointmentLayout