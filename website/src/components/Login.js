import React, { useState, useContext } from 'react';
import { UserContext } from '../userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { setUserContext } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const data = new URLSearchParams();
        data.append('username', username);
        data.append('password', password);

        try {
            const res = await axios.post('http://localhost:5000/login', data);
            if (res.status === 200) {
                // Login was successful
                console.log('Logged in successfully');
                //console.log(data);
                setUserContext(res.data);
                navigate("/");
            }
        } catch (err) {
            // Handle error response from the server
            if (err.response) {
                setError(err.response.data.error);
            } else {
                setError("Login failed. Please try again later.");
            }
        }
        
    }

    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            {error && <p>{error}</p>}
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
            <button type="submit">Login</button>
        </form>
    );
}

export default Login;
