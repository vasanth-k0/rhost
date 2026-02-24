import {createContext, useContext} from 'react';

const Theme = createContext(null);
const useTheme = ()=>useContext(Theme)

export {Theme, useTheme};