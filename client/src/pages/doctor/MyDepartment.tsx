import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { authUser } from '../../features/auth/authSlice'
import { getMyDepartment, getMyDepartmentAppointments, myDepartmentAppointments, myDepartmentResult } from '../../service/departmentSideFunctions'
import { Card, Spinner, Table, Tabs } from 'flowbite-react'
import CustomImg from '../../components/CustomImg'
import ErrorMessage from '../../components/ErrorMessage'
import {HiOutlineUser,HiOutlineUserGroup, HiOutlineCalendarDays, HiOutlineCheckCircle, HiOutlineClock} from "react-icons/hi2"
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, Cell, BarChart, CartesianGrid, Bar, YAxis, XAxis } from 'recharts';
import CustomCardTooltip from '../../components/CustomCardTooltip'

const COLORS = ['#2986cc','#c90076', '#cccccc']

const MyDepartment: React.FC = () => {

  const [loading, setLoading] = useState<boolean>(false)
  const {accessUser} = useSelector(authUser)
  const [response, setResponse] = useState<myDepartmentResult>()
  const [departmentAppointments, setDepartmentAppointments] = useState<myDepartmentAppointments>()
  const [badResponse, setBadResponse] = useState<string | unknown>("")

  useEffect(() => {
    const fetchData = async () =>{
        try{
            setLoading(true)
            if(accessUser){
                const response = await getMyDepartment(accessUser.token)
                setResponse(response)
            }
        }catch(err) {
          setBadResponse(err)
        }finally{
            setLoading(false)
        }
    }
    fetchData();
  }, [accessUser])

  useEffect(() => {
    const fetchData = async () =>{
        try{
            setLoading(true)
            if(accessUser){
                const response = await getMyDepartmentAppointments(accessUser.token)
                setDepartmentAppointments(response)
            }
        }catch(err) {
          setBadResponse(err)
        }finally{
            setLoading(false)
        }
    }
    fetchData();
  }, [accessUser])

  return (
    <div className='font-Poppins h-full transition-all duration-900 pr-3'>
      {loading ?
        <div className='h-full w-full flex justify-center items-center'>
          <Spinner size="xl" />
        </div>
      : 
       badResponse !== '' ? 
       <div>
        <ErrorMessage text={badResponse as string} size='md' />
       </div> :
      <div className='h-full'>
        <div className='flex justify-between p-3 align-items'>
          <h1 className='font-semibold text-2xl'>{response?.department.name}</h1>
          <Link to={`tel:${response?.department.phone_number}`} className='cursor-pointer text-sm my-auto text-blue-700'><span className='text-black'> Phone number: </span> +{response?.department.phone_number}</Link>
        </div>
        <hr />
        <div className='w-full h-[83vh] divide-x flex px-2'>
          <div className='mt-5 w-2/5'>
            <Tabs.Group
              aria-label="Default tabs"
              style="default"
            >
              <Tabs.Item
                active
                title="Active"
              >
                <Table>
                  <Table.Body className="divide-y">
                    {response?.todayActiveDoctors.map((d) =>(
                      <Table.Row key={d._id}>
                        <Table.Cell>
                          <CustomImg url={d.user_id.photo} className='w-[40px] h-[40px]' />
                        </Table.Cell>
                        <Table.Cell className='font-semibold text-sm text-gray-700'>
                        {d.user_id._id === accessUser?.data._id ?
                           <p>You</p> :
                          <p>Dr. {d.first_name + " " + d.last_name}</p>}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </Tabs.Item>
              <Tabs.Item
                title="Other"
              >
                    {response && response?.otherDoctors.length > 0 ?
                <Table className='h-full'>
                  <Table.Body className="divide-y">
                      {response.otherDoctors.map((d) =>(
                        <Table.Row key={d._id} className='bg-gray-100'>
                          <Table.Cell>
                            <CustomImg url={d.user_id.photo} className='w-[40px] h-[40px] rounded-full' />
                          </Table.Cell>
                          <Table.Cell className='font-semibold text-md text-gray-700'>
                            {d.user_id._id === accessUser?.data._id ?
                            <p>You</p> :
                            <p>Dr. {d.first_name + " " + d.last_name}</p>}
                          </Table.Cell>
                        </Table.Row>
                      ))
                    }
                  </Table.Body>
                </Table>
                    : <ErrorMessage text='There are no more doctors!' size='md' />}
              </Tabs.Item>
            </Tabs.Group>
          </div>
          <div className='w-full pl-4 py-4 flex flex-col justify-between'>
            <div>
              <p className='text-sm text-justify mt-2'>
              We are delighted to welcome you to the {response?.department.name} Department, where excellence in healthcare is our commitment. As you embark on your journey with us, we want to ensure you have all the essential information at your fingertips to navigate your department effectively.Thank you for your dedication to our mission of providing exceptional healthcare to our community. Together, we will continue to make a positive impact on the lives of our patients.
              </p>
              </div>
            <div className='flex mt-2  justify-around'>
              <CustomCardTooltip tooltip_content='Number of doctors' text={response?.numberOfDoctors || 0}>
                <HiOutlineUserGroup className="w-[18px] h-[18px]" />
              </CustomCardTooltip>
              <CustomCardTooltip tooltip_content='Number of active doctors' text={response?.numberOfActiveDoctors || 0}>
                <HiOutlineUser className="w-[18px] h-[18px]" />
              </CustomCardTooltip>
              <CustomCardTooltip tooltip_content='Number of appointments today' text={departmentAppointments?.todayAppointment.total || 0}>
                <HiOutlineCalendarDays className="w-[18px] h-[18px]" />
              </CustomCardTooltip>
              <CustomCardTooltip tooltip_content='Finished appointments' text={departmentAppointments?.todayAppointment.finished || 0}>
                <HiOutlineCheckCircle className="w-[18px] h-[18px]" />
              </CustomCardTooltip>
              <CustomCardTooltip tooltip_content='Pending appointments' text={departmentAppointments?.todayAppointment.pending || 0}>
                <HiOutlineClock className="w-[18px] h-[18px]" />
              </CustomCardTooltip>
            </div>
            <div className='w-full flex h-fit'>
              <Card className='w-3/4 mr-4 text-xs'>
                <ResponsiveContainer width="100%" height="100%" className="!p-0">
                  <BarChart
                    width={500}
                    height={300}
                    data={departmentAppointments?.appointmentsByDay}
                    margin={{
                      top:0,
                      left: -35,
                      bottom: 0
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" barSize={10} fill="#1d4ed8" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <Card className='w-1/3 ml-auto h-[350px]'>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart width={300} height={300} margin={{
                    top: 0,
                    left: -25
                  }}>
                    <Pie
                      data={response?.gender}
                      cx="50%"
                      cy="50%"
                      label
                      animationDuration={500}
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {response?.gender.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend layout='vertical' />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </div>
        </div>
      </div>
      }
    </div>
  )
}

export default MyDepartment