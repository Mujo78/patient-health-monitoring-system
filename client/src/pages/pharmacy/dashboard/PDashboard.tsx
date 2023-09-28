import React from 'react'
import { PharmacyDashboardType } from '../../../service/pharmacySideFunctions'
import { Card } from 'flowbite-react'
import CustomMedicineImg from '../../../components/CustomMedicineImg'
import { formatDate } from '../../../service/appointmentSideFunctions'
import { Link } from 'react-router-dom'

type Props = {
    data: PharmacyDashboardType
}

const PDashboard: React.FC<Props> = ({data}) => {
  return (
    <>
            <Card className='w-1/4' href={`/profile/ph/${data.pharmacy._id}`}>
                <div className='flex flex-col gap-7'>
                    <h1 className='text-center text-2xl font-semibold'>{data.pharmacy.name}</h1>
                    <hr/>
                    <div className='flex justify-between'>
                        <p>Address:</p>
                        <p className='text-gray-400'>{data.pharmacy.address}</p>
                    </div>
                    <div className='flex justify-between'>
                        <p>Phone number: </p>
                        <p className='text-gray-400'>+{data.pharmacy.phone_number}</p>
                    </div>
                    <div>
                        <p>Working hours:</p>
                        <p className='text-gray-400 mt-2 text-xl text-center'>{data.pharmacy.working_hours}</p>
                    </div>
                </div>
            </Card>
        <div className='flex w-1/3 gap-5 justify-between'>
            <div className='flex flex-col w-full justify-around'>
                <Card className='max-w-xs'>
                    <p className='text-center text-sm'>Num. of medicine</p>
                    <h1 className='text-4xl mx-auto font-semi-bold text-green-500 my-auto'>{data.total.total_number}</h1>
                </Card>
                <Card className='max-w-xs'>
                    <p className='text-center text-sm'>Total available</p>
                    <h1 className='text-4xl mx-auto text-green-500 font-semi-bold my-auto'>{data.total.total_available}</h1>
                </Card>
            </div>
            <div className='flex flex-col w-full justify-around'>
                <Card className='max-w-xs'>
                    <p className='text-center text-sm'>Price of medicine</p>
                    <h1 className='text-4xl mx-auto text-green-500 font-semi-bold my-auto'>{data.total.total_price}</h1>
                </Card>
                <Card className='max-w-xs'>
                    <p className='text-center text-sm'>Total not available</p>
                    <h1 className='text-4xl mx-auto text-red-600 font-semi-bold my-auto'>{data.total.total_not_available}</h1>
                </Card>
            </div>
        </div>
            <Card className='w-1/3'>
                <div className=''>
                    <p>Recent added medicine</p>
                    <div className='divide-y mt-3'>
                        {data.recentMedicine.map((m) => (
                            <Link to={`/medicine/${m._id}`} key={m._id} className='flex gap-3 items-center p-4 transition-all duration-100 hover:bg-gray-100 cursor-pointer'>
                                <CustomMedicineImg url={m.photo} className='w-[40px] h-[40px] rounded-full' />
                                <p className='text-xs'>{m.name}({m.strength + " mg"})</p>
                                <p className='text-xs ml-auto'>{formatDate(m.createdAt)}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </Card>
        </>
  )
}

export default PDashboard
