import React, { useEffect, useState } from 'react'
import {getDepartments, getDoctorsForDepartment}  from "../../../service/appointmentSideFunctions"
import { Spinner, Table } from 'flowbite-react'
import CustomButton from '../../../components/CustomButton'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import {HiChevronRight} from "react-icons/hi2"
import CustomImg from '../../../components/CustomImg'
import { UserInfo } from '../../../features/appointment/appointmentSlice'
import Footer from '../../../components/Footer'

type Department = {
    _id: string,
    name: string,
    description: string,
    phone_number: string
}

export type Doctor = {
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

const AppointmentDepartment: React.FC = () => {

    const {doctorId} = useParams()
    const navigate = useNavigate()
    const [selectedDep, setSelectedDep] = useState<string>("")
    const [selectedDoc, setSelectedDoc] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingDoc, setLoadingDoc] = useState<boolean>(false)
    const [res, setRes] = useState<Department[]>([])
    const [doc, setDoc] = useState<Doctor[]>([])

    useEffect(() => {
        const fetchData = async () =>{
            try{
                setLoading(true)
                const response = await getDepartments()
                setRes(response)
            }finally{
                setLoading(false)
            }
        }
        fetchData();
    }, [])

    const chooseDepartment = (name: string) => {
        setSelectedDoc("")
        setSelectedDep(name)
        const fetchData = async () =>{
            if(name){
                try{
                    setLoadingDoc(true)
                    const response = await getDoctorsForDepartment(name)
                    setDoc(response)
                }finally{
                    setLoadingDoc(false)
                }
            }
        }
        fetchData();
    }

    const handleNavigate = () =>{
        navigate(`${selectedDoc}`, {replace: true})
    }

    return (
        <>
            {doctorId ? <Outlet /> : 
                <div className='font-Poppins flex flex-col h-full' >
                    <div className='flex justify-between flex-wrap flex-grow'>
                    <div className=' overflow-y-auto'>
                        <h1 className='text-3xl font-semibold p-4'>Departments</h1>
                        <p className='text-sm text-gray-400'>Please choose department for appointment. Make sure to choose only one department!</p>
                        <div className='flex w-full justify-center mt-2'>
                            {loading ? <Spinner /> : <Table hoverable>
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
                                    {res.length > 0 &&
                                        res.map((n) => <Table.Row onClick={() => chooseDepartment(n.name)} key={n._id} className={`bg-white cursor-pointer dark:border-gray-700 ${selectedDep === n.name && 'bg-blue-200'} dark:bg-gray-800`}>
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {n.name}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {n.description}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <HiChevronRight />
                                        </Table.Cell>
                                    </Table.Row>)}
                                </Table.Body>
                            </Table>}
                        </div>
                    </div>
                    <div className='mt-2 mb-2 w-2/5'>                       
                    {loadingDoc ? <div className='mx-auto flex justify-center mt-4'> <Spinner /> </div> :
                        <Table className='w-4/5 flex flex-col justify-center'>
                            <Table.Body className='divide-y'> 
                            {doc.length > 0 &&
                            doc.map((n) => (
                                <Table.Row
                                key={n._id}
                                className={`w-2/5 ${selectedDoc === n._id && 'bg-blue-200'} cursor-pointer`}
                                onClick={() => setSelectedDoc(n._id)}
                            >
                                <Table.Cell>
                                    <CustomImg url={n.user_id.photo} className='w-[60px] rounded-full' />
                                </Table.Cell>
                                <Table.Cell>
                                    <h1 className='font-bold text-md'>{"Dr. " + n.first_name + " " + n.last_name}</h1>
                                </Table.Cell>
                                <Table.Cell className='w-1/3'>
                                    <p className='text-xs'>{n.bio.split(".")[0]}</p>
                                </Table.Cell>
                            
                            </Table.Row>
                            ))}
                            </Table.Body>
                        </Table>}
                    </div>
                    </div>
                   <Footer variant={1}>
                        <CustomButton disabled={selectedDoc === ""} onClick={handleNavigate} size='md' className='ml-auto mr-3 my-3'>
                            Continue
                        </CustomButton>
                   </Footer>
               
            </div>}
        </>
    )
}

export default AppointmentDepartment