import {createContext} from 'react';

export const ThemeContext = createContext({});
export const ThemeContextProvider = ({children}) => {
    const {login} = useContext(UserContext)
    const [theme, setTheme] = useState(null);
    const getTheme = async () => {
        const themeUrl= "/system/theme"
        let res = await fetch(themeUrl);
        res = await res.json();
        res.available = availableColours;
        setTheme(res);
        localStorage.setItem('theme', JSON.stringify(res));
    }

    useEffect(()=>{
        (async()=>{
            /**
             * get and set Theme
             */
            if ( !login ) {
                let localTheme = localStorage.getItem('theme');
                if ( localTheme != null) {
                    setTheme(JSON.parse(localTheme));
                } else {
                    getTheme();
                }
            } else {
                getTheme();
            }
        })();
    }, [login]);

    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}