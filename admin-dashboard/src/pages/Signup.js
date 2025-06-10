import React from 'react';
import Template from '../components/Template';
import signimg from '../assets/signup.jpg';

function Signup({ setIsLoggedin }) {
    return (
        <Template
            title="Create Your Admin Account"
            desc1="Join the Cybersecurity Admin Console and take control."
            desc2="Manage users, track threats, and secure your organization."
            formtype="signup"
            image={signimg}
            setIsLoggedin={setIsLoggedin}
        />
    );
}

export default Signup;
