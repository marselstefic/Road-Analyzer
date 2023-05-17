import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserContext } from "./userContext";
import Header from "./components/Header";
import Data from "./components/Data";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Logout from "./components/Logout";

/*
const [user, setUser] = useState(localStorage.user ? JSON.parse(localStorage.user) : null);
const updateUserData = (userInfo) => {
  localStorage.setItem("user", JSON.stringify(userInfo));
  setUser(userInfo);
}

*/




function App() {

  return (
      <BrowserRouter>

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
      </BrowserRouter>
  );
}

export default App;
