import {useContext} from "react";

const AccountsControl = () => {
    const {settings} = useContext(SystemContext);
    return (
        <div style={{ marginTop: '10px'}}>
            Guests are requested to login with any of the supported social login from Social login tab.
            <br /> <br />
            <br /> System admins and Super admin to login through Admin login tab
            <br /> For support please contact system admin at {settings['contactAdmin']}
        </div>
    )
}

export default AccountsControl;
