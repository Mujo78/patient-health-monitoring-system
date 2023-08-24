import { Button } from 'flowbite-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {
    variant: number,
    children?: React.ReactNode
}


const Footer: React.FC<Props> = ({variant, children}) => {
  
    const navigate = useNavigate();
    const goBack = () => {
        navigate("../", {replace: true})
      }
  
    return (
    <div className='w-full mt-auto font-Poppins'>
        <hr/>
        <div className={`flex justify-${variant === 1 ? "end" : "between  mb-3 mt-3"}`}>
            {variant === 2 && <Button color="light" onClick={goBack}>
              Back
            </Button>}
            {children}
          </div>
    </div>
  )
}

export default Footer