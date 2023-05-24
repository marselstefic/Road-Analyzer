import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        // Ensure the passwords match
        if (password !== password2) {
            setError('Passwords do not match');
            return;
        }

        const data = new URLSearchParams();
        data.append('username', username);
        data.append('email', email);
        data.append('password', password);
        data.append('password2', password2);

        try {
            const res = await axios.post('http://localhost:5000/register', data);
            if (res.data.message) {
                // Registration was successful
                console.log(res.data.message);
                // You can do a redirect here to the login page or a welcome page
            }
        } catch (err) {
            // Handle error response from the server
            if (err.response) {
                setError(err.response.data.error);
            } else {
                setError("Registration failed. Please try again later.");
            }
        }
    }

    return (
        <form onSubmit={handleRegister}>
            <h2>Register</h2>
            {error && <p>{error}</p>}
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
            <input type="password" placeholder="Confirm Password" value={password2} onChange={(e) => setPassword2(e.target.value)} required/>
            <button type="submit">Register</button>
        </form>
    );
}

export default Register;
