import { redirect } from 'react-router-dom';

const DoctorCheck = () => {
    const user = localStorage.getItem("user")
    const userObj = user && JSON.parse(user)

    if (userObj.data.role !== 'PHARMACY') {
        return redirect('/error-page');
    }

    return null
}

export default DoctorCheck