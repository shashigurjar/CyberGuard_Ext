import React from 'react';
import { useEffect, useState } from 'react';
import {Navigate} from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

function PrivateRoute({children}){
    const [auth, setAuth] = useState(null)

    useEffect(() => {
        fetch(`${API_URL}/api/auth/dashboard`, {
        credentials: "include",
        })
        .then((res) => {
        setAuth(res.ok)
        })
        .catch(() => setAuth(false))
    }, []);

      if (auth === null) {
        return <div className="text-white p-4">Loading...</div>; // optional spinner
    }

    return auth ? children : <Navigate to="/login" />;
}
export default PrivateRoute;