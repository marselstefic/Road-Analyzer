import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserContext } from "./userContext";
import Header from "./components/Header";
import Data from "./components/Data";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Logout from "./components/Logout";

function App() {
    let initialUser;
    try {
      initialUser = JSON.parse(localStorage.getItem("user"));
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      initialUser = null;
    }
    const [user, setUser] = useState(initialUser);
  
    const updateUserData = (userInfo) => {
        localStorage.setItem("user", JSON.stringify(userInfo));
        setUser(userInfo);
    }

    return (
        <BrowserRouter>
            <UserContext.Provider value={{
                user: user,
                setUserContext: updateUserData
            }}>
                <div className="App">
                    <Header title="My application:"></Header>
                    <Routes>
                        <Route path="/data" element={<Data />}></Route>
                        <Route path="/login" exact element={<Login />}></Route>
                        <Route path="/register" element={<Register />}></Route>
                        <Route path="/profile" element={<Profile />}></Route>
                        <Route path="/logout" element={<Logout />}></Route>
                    </Routes>
                </div>
            </UserContext.Provider>
        </BrowserRouter>
    );
}

export default App;
