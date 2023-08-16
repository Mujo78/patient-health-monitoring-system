import React from 'react'
import defaultImg from "../assets/default.jpg"

type Props = {
    url: string | undefined,
    className?: string
}

const CustomImg: React.FC<Props> = ({url, className}) => {
  
    const imgUpload = `http://localhost:3001/uploads/${url}`
  
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = defaultImg
    }

    return (
        <img
        className={className}
        src={imgUpload}
        alt="Uploaded"
        onError={handleImageError}
      />
  )
}

export default CustomImg