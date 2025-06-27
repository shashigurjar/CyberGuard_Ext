import React from 'react';
import Template from '../components/Template';
import logimg from '../assets/login2.png';

function Login({ setIsLoggedin }) {
    return (
        <Template
            title="Welcome Back!"
            desc1="Access your Cybersecurity Admin Dashboard securely."
            desc2="Monitor threats, manage defenses, and safeguard critical systems."
            formtype="login"
            image={logimg}
            setIsLoggedin={setIsLoggedin}
        />
    );
}

export default Login;
