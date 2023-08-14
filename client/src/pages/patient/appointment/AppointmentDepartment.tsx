import React, { useEffect, useState } from 'react'
import {getDepartments}  from "../../../service/appointmentSideFunctions"
import { Table } from 'flowbite-react'
import CustomButton from '../../../components/CustomButton'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'


type Department = {
    _id: string,
    name: string,
    description: string,
    phone_number: string
}

const AppointmentDepartment: React.FC = () => {

    const navigate = useNavigate()
    const location = useLocation();
    const [res, setRes] = useState<Department[]>([])
    const [isDepSet, setIsDepSet] = useState<boolean>(false)

    useEffect(() => {
        const fetchData = async () =>{
            const response = await getDepartments()
            setRes(response)
        }
        fetchData();
    }, [])

    const chooseDepartment = (name: string) => {
        navigate(`${name}`, {replace: true})
        setIsDepSet(true)
    }

  return (
    <>
        {isDepSet || location.pathname.startsWith("appointment/new/") ? <Outlet /> : <div className='font-Poppins'>
            <h1 className='text-3xl font-semibold p-4'>Departments</h1>
            <p className='text-sm text-gray-400'>Please choose department for appointment. Make sure to choose only one department!</p>

            <div className='flex w-full '>
                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell>
                            Name
                        </Table.HeadCell>
                        <Table.HeadCell>
                            Description
                        </Table.HeadCell>
                        <Table.HeadCell>
                        
                        </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {res.map((n) => <Table.Row key={n._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {n.name}
                            </Table.Cell>
                            <Table.Cell>
                                {n.description}
                            </Table.Cell>
                            <Table.Cell>
                                <CustomButton onClick={() => chooseDepartment(n.name)}>
                                    Choose
                                </CustomButton>
                            </Table.Cell>
                        </Table.Row>)}
                    </Table.Body>
                </Table>
            </div>
        </div>}
    </>
  )
}

export default AppointmentDepartment