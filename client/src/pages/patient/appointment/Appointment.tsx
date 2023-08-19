import React from 'react'
import { useParams } from 'react-router-dom'

const Appointment: React.FC = () => {
    const {id} = useParams();

  return (
    <div>
        Appointment: {id}
    </div>
  )
}

export default Appointment