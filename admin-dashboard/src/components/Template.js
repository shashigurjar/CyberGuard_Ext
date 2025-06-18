import React from 'react';
import Login from './Login';
import Signup from './Signup';

function Template({ title, desc1, desc2, formtype, image, setIsLoggedin }) {
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-6">
            <div className="max-w-6xl w-full flex flex-col md:flex-row justify-between gap-10">
                <div className="md:w-1/2">
                    <h1 className="text-3xl font-bold mb-2">{title}</h1>
                    <p className="mb-6 text-gray-300">
                        <span>{desc1}</span>
                        <br />
                        <span className="italic text-blue-300">{desc2}</span>
                    </p>

                    {formtype === 'login' ? (
                        <Login setIsLoggedin={setIsLoggedin} />
                    ) : (
                        <Signup setIsLoggedin={setIsLoggedin} />
                    )}

                    <div className="flex items-center gap-2 mt-6 mb-4">
                        <div className="h-px w-full bg-gray-600" />
                        <p className="text-gray-400">OR</p>
                        <div className="h-px w-full bg-gray-600" />
                    </div>

                    <button className="w-full flex items-center justify-center gap-2 border border-gray-600 px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" className="w-5 h-5" />
                        <p>Sign Up with Google</p>
                    </button>
                </div>

                <div className="md:w-1/2 flex justify-center items-center">
                    <img src={image} alt="Student" width={558} height={560} loading="lazy" className="rounded-md border border-gray-600" />
                </div>
            </div>
        </div>
    );
}

export default Template;
