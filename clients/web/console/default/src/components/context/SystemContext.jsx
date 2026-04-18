export const SystemContext = createContext(null);
export const SystemContextProvider = ({children}) => {
    const [settings, setSettings] = useState({
        "defaultApp": "coderun-lite",
    });
    useEffect(()=>{
        (async()=>{

            const settingsUrl= "/system/settings"
            let sets = await fetch(settingsUrl);
            sets = await sets.json();
            setSettings(sets);
                        
        })();
    },[]);

    return <SystemContext.Provider value={{ settings, setSettings }} >{children}</SystemContext.Provider>
}