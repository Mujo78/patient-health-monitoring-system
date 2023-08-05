import React, { useState } from "react"
import SignUpForm from "./auth/SignUpForm"
import LoginForm from "./auth/LoginForm"
import SignUpInfo from "./auth/SignUpInfo"
import LoginInfo from "./auth/LoginInfo"


export type Props = {
    setSignUp: React.Dispatch<React.SetStateAction<boolean>>
}


const LandingPage: React.FC = () => {

    const [signup, setSignUp] = useState<boolean>(false)

  return (
    <div className='text-start w-full h-screen flex items-center'>
        <div className={`w-3/4 flex justify-center flex-col ${signup ? 'animate-slide-right' : 'animate-slide-back-right'}`}> 
        {signup ?
           <div className={`w-2/4 mx-auto `}>
               <SignUpForm />
               </div> : 
              <div className={`w-2/4 mx-auto`}>
               <LoginForm />
           </div>
        }
  </div>
  <div className={`bg-blue-700 w-1/4 h-screen flex-col flex items-center justify-center ${signup ? 'animate-slide-left' : ' animate-slide-back-left'}`}>
    <div className='w-full px-10 mx-5 flex flex-col justify-center'>
      {signup ?
            <SignUpInfo setSignUp={setSignUp}/>
          : <LoginInfo setSignUp={setSignUp} />   
    }
    </div>
  </div>
    </div>
  )
}

export default LandingPage
