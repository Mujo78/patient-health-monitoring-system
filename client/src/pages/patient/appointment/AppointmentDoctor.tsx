import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { getDoctorsForDepartment } from '../../../service/appointmentSideFunctions'
import CustomButton from '../../../components/CustomButton'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Avatar, Card } from 'flowbite-react'

type UserInfo = {
    photo: string,
    _id: string
}

type Doctor = {
    _id: string,
    address : string,
    bio: string,
    first_name: string,
    last_name: string, 
    phone_number: string,
    qualification: string,
    speciality: string,
    user_id: UserInfo
}

const AppointmentDoctor: React.FC = () => {

    const {departmentName} = useParams()
    const navigate = useNavigate()
    const location = useLocation();
    const [res, setRes] = useState<Doctor[]>([])
    const [isDepSet, setIsDepSet] = useState<boolean>(false)


    useEffect(() => {
        const fetchData = async () =>{
            if(departmentName){
                const response = await getDoctorsForDepartment(departmentName)
                setRes(response)
                console.log(response)
            }
        }
        fetchData();
    }, [departmentName])
    
  return (
    <div>
        {res.map((n) => (
            <Card key={n._id}>
                <h1>{n.first_name + " " + n.last_name}</h1>
            </Card>
        ))}
    </div>
  )
}

export default AppointmentDoctor