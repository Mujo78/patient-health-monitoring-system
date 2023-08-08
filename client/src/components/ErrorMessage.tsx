import React from 'react'

type Props = {
    text?: string
}

const ErrorMessage: React.FC<Props> = ({text}) => {
  return <div className='h-4 font-Poppins'>
      <p className='text-red-600 text-xs'>{text}</p>
  </div>
}

export default ErrorMessage
