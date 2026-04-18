import {Children, createContext} from 'react';

export const UserContext = createContext(null);
export const UserContextProvider = ({children}) => {
    const [login, setLoginStatus] = useState(null);
    return <UserContext.Provider value={{ login, setLoginStatus }}>{children}</UserContext.Provider>
}