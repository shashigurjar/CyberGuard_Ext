import React from 'react';
import { useEffect, useState } from 'react';
import {Navigate} from 'react-router-dom';
function PrivateRoute({children}){
    const [auth, setAuth] = useState(null)

    useEffect(() => {
        fetch('http://localhost:8000/api/auth/dashboard', {
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