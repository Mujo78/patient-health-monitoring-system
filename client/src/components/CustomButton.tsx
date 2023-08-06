import { Button } from 'flowbite-react'
import React from 'react'

type Props = {
  children: string,
  onClick?: React.MouseEventHandler<HTMLButtonElement>,
  type?: string,
  className?: string
}


const CustomButton: React.FC<Props> = ({children, type, onClick}) => {
  return <Button type={type} onClick={onClick} className="!bg-blue-700 hover:!bg-blue-600 transition-colors duration-300" >{children}</Button>
}

export default CustomButton
