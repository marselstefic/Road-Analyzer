import { useEffect, useContext } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';

function Logout(){
    const userContext = useContext(UserContext);
    useEffect(function(){
        const logout = async function(){
            try {
                const res = await fetch("http://localhost:5000/logout", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                if (!res.ok) {
                    throw new Error("Logout failed");
                }

                userContext.setUserContext(null);
            } catch (err) {
                console.error("Failed to logout:", err);
                // optionally show the error to the user
            }
        }
        logout();
    }, []);

    return (
        <Navigate replace to="/" />
    );
}

export default Logout;
