import { redirect } from 'react-router-dom';

const Authorized = () => {
    const user = localStorage.getItem("user")
    const userObj = user && JSON.parse(user)

    const route = userObj?.data.role.toLowerCase();

    if (userObj) {
        return redirect(`/${route}/${userObj.data._id}`);
    }

    return null
}

export default Authorized