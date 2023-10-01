import React from 'react'
import { PharmacyDashboardInfoType } from '../../../service/pharmacySideFunctions'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, XAxis, YAxis, Bar } from 'recharts';
import { Card } from 'flowbite-react';
import { Link } from 'react-router-dom';

type Props = {
    data: PharmacyDashboardInfoType
}

const COLORS = ['#15803d','#22c55e', '#86efac', '#dcfce7', '#d1d5db']

const PDashboardInfo: React.FC<Props> = ({data}) => {
  return (
    <>
    {data.topExpensive.length > 0 ?
        <>
            <Card className='w-2/5'>
                    <p>The most expensive medicine</p>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                        className='text-xs'
                        width={500}
                        height={300}
                        data={data.topExpensive}
                        margin={{
                            top: 5,
                            right: 0,
                            left: 5,
                            bottom: 5,
                        }}
                        layout='vertical'
                        >
                        <XAxis type='number' />
                        <YAxis dataKey="name" type='category'  />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" barSize={10} fill="#15803d" />
                        </BarChart>
                    </ResponsiveContainer>
            </Card>
            <Card className='w-1/4'>
                <div className='flex flex-col gap-4 justify-start mb-auto'>
                    <p>The most used medicine</p>
                    <div className='divide-green-500 divide-y'>
                        {data?.usedMedicine?.map((m) => (
                            <Link to={`/medicine/${m._id}`} className='flex p-3 w-full cursor-pointer hover:bg-gray-100' key={m._id}>
                                <div className='flex justify-between items-center w-full'>
                                    <p>{m.name}</p>
                                    <p className='ml-auto'>{m.value}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </Card>
            <Card className='w-1/3 h-full'>
                <p>Top categories</p>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={300} height={200}>
                    <Pie
                        dataKey="value"
                        data={data.data}
                        cx="50%"
                        cy="55%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={6}
                        fill="#8884d8"
                        label
                    >
                            {data.data?.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                        ))}
                        </Pie>
                        <Tooltip />
                        <Legend align='right' layout='vertical' verticalAlign="middle" />
                    </PieChart>
                </ResponsiveContainer>
            </Card>
        </> :
        <Card className='w-full'>
            <Link to={"/add-medicine"}>
                <div className='w-full text-center flex flex-col gap-4'>
                    <p className='text-xl text-gray-400'>There are no medicines in database!</p>
                    <p className='text-xs text-gray-400'>Make sure to add medicines and see statistics</p>
                </div>
            </Link>
        </Card>
        }
    </>
  )
}

export default PDashboardInfo
