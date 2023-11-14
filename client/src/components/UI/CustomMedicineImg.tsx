import React from 'react'
import defaultIg from "../../assets/default-medicine.jpg" 

type Props = {
    url: string,
    className?: string
}

const CustomMedicineImg: React.FC<Props> = ({url, className}) => {
  
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = defaultIg
    }

    return (
        <img 
            src={url} 
            alt='medicine-image' 
            className={className && className}
            onError={handleImageError}
        />
    )
}

export default CustomMedicineImg