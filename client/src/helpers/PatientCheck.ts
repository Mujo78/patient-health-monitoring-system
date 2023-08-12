import { redirect } from 'react-router-dom';

const PatientCheck = () => {
    const user = localStorage.getItem("user")
    const userObj = user && JSON.parse(user)

    if (userObj.data.role !== 'PATIENT') {
        return redirect('/error-page');
    }

    return null
}

export default PatientCheck