import React, { useState } from 'react';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const formStyles: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '50px',
    };

    const labelStyles = {
        display: 'block',
        marginBottom: '5px',
    };

    const inputStyles = {
        padding: '5px',
        marginBottom: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    };

    const buttonStyles = {
        padding: '5px 10px',
        borderRadius: '5px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
    };

    const divStyle = {
        maxWidth: '600px',
        margin: '0 auto 300px',
        backgroundColor: 'lightgreen',
        padding: '20px 30px',
        borderRadius: '10px',
    };

    return (
        <div style={divStyle}>
            <form style={formStyles}>
                <label style={labelStyles} htmlFor="username">Username:</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyles} />

                <label style={labelStyles} htmlFor="password">Password:</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyles} />

                <button type="submit" style={buttonStyles}>Login</button>
            </form>
        </div>
    );

}

export default LoginForm;