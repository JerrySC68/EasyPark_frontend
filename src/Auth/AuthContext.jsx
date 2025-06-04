import { useContext, createContext, useState } from "react";



const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
        const storedValue = localStorage.getItem('user');
        return storedValue ? JSON.parse(storedValue) : null;
    })
    const login = (userName, passWord) => {
        setUser({ username: userName, password: passWord });
        localStorage.setItem('user',  JSON.stringify({ username: userName, password: passWord })); //localStorage.setItem solo almacena cadenas
    }
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    }
    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth =()=> useContext(AuthContext);