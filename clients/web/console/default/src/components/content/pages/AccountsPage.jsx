import SignIn from "../../Signin";
const AccountsPage = () => {
    const {login} = useContext(UserContext);
    return ((!login) ? <SignIn />: <>AccountsPage</>)
}

export default AccountsPage;
