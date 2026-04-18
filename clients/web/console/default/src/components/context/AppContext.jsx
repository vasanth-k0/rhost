import { createContext } from "react"

export const AppContext = createContext({});
export const AppContextProvider = ({children}) => {
    const [Apps, setApps] = useState([]);
    
    useEffect(()=>{
        (async()=>{

            let appList = await fetch("/apps/list");
            appList = await appList.json();
            setApps(appList);
                        
        })();
    },[]);

    return <AppContext.Provider value={{ Apps, setApps }}>{children}</AppContext.Provider>
}
