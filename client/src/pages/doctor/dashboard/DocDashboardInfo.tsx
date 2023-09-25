import React from 'react'
import { DocDashboardInfoType, formatDate, formatStartEnd } from '../../../service/appointmentSideFunctions'
import { Card } from 'flowbite-react'
import CustomImg from '../../../components/CustomImg'
import { PieChart, Pie, ResponsiveContainer, Tooltip, Legend, Cell } from 'recharts';
import moment from 'moment'

const COLORS = ['#2986cc','#c90076', '#cccccc']

type Props = {
  docDash: DocDashboardInfoType
}
const DocDashboardInfo: React.FC<Props> = ({docDash}) => {

  return (
    <>
      {docDash ? (
        <>
            <Card className='max-w-xs cursor-pointer' href='/my-department'>
                <p className='text-sm'>My department</p>
                <h1 className='text-xl font-bold mx-auto'>{docDash.department_name}</h1>
                <p className='text-xs text-blue-700 ml-auto'>See more  {"->"}</p>
            </Card>
            <Card className='cursor-pointer max-w-xs' href={`/appointments/${docDash.latest._id}`}>
                <div className='flex items-center gap-4'>
                   <CustomImg url={docDash.latest.patient_id?.user_id?.photo} className='w-[80px] h-[80px] rounded-full' />
                   <div className='flex flex-col gap-1'>
                        <h1 className='text-xl font-bold'>{docDash.latest.patient_id.first_name + " " + docDash.latest.patient_id.last_name}</h1>
                        <p className='ml-auto'>Age: {moment().diff(moment(docDash.latest.patient_id.date_of_birth), 'years')} </p>
                        <p className='text-xs text-gray-400'>{formatDate(docDash.latest.appointment_date)}</p>
                        <p className='text-xs text-gray-400'>({formatStartEnd(docDash.latest.appointment_date)})</p>
                   </div>
                </div>
            </Card>
            <Card className='max-w-xs h-2/5'>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={300} height={100} className='flex items-center'>
                    <Pie
                        className='cursor-pointer transition-all duration-300'
                        dataKey="value"
                        startAngle={180}
                        endAngle={0}
                        data={docDash.gender}
                        innerRadius={50}
                        cx="50%"
                        cy="80%"
                        outerRadius={80}
                        label
                    >
                        {docDash.gender?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                      ))}
                        </Pie>
                        <Tooltip />
                        <Legend layout='vertical' />
                    </PieChart>
                </ResponsiveContainer>
            </Card>
        </>
      ): (
        <p>Nothing</p>
      )}
    </>
  )
}

export default DocDashboardInfo
