import { Button } from 'flowbite-react'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Patient:React.FC = () => {

    const navigate = useNavigate()
    const {id} = useParams()

    const navigatePrevious = () => {
        const route = localStorage.getItem("route")
        navigate(`${route}`);
    }

  return (
    <>
        <p>{id}</p>
        <Button color="failure" onClick={navigatePrevious}>Go Back</Button>
    </>
  )
}

export default Patient