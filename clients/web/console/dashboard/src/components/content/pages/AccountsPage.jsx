import SiginIn from "../../Signin";
import { useContext } from 'react';
import UserContext from '../../context/UserContext';

const AccountsPage = () => {
    const {login} = useContext(UserContext);
    return ((!login) ? <SiginIn />: <>AccountsPage</>)
}

export default AccountsPage;
