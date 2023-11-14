import React, { useEffect, useState } from 'react'
import CustomButton from '../../../components/UI/CustomButton'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const AppointmentLayout: React.FC = () => {

    const navigate = useNavigate();
    const [newApp, setNewApp] = useState<boolean>(false)
    const location = useLocation()

    useEffect(() =>{
        if(location.pathname !== "/appointment"){
            setNewApp(true)
        }else{
            setNewApp(false)
        }
    }, [location])

    const makeNewAppointment = () => {
        navigate("new", {replace: true})
        setNewApp(true)
    }

  return (
    <>
        {newApp ? <Outlet /> : <div className='flex justify-center font-Poppins items-center h-full'>
            <CustomButton onClick={makeNewAppointment}>
                Make appointment
            </CustomButton>
        </div>}
    </>
  )
}

export default AppointmentLayout