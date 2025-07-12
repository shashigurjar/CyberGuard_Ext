import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function Signup({ setIsLoggedin }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmpassword: ""
    });

    function changeHolder(event) {
        setFormData((prev) => ({
            ...prev,
            [event.target.name]: event.target.value
        }));
    }

    async function submitHandler(event) {
        event.preventDefault();
        if (formData.password !== formData.confirmpassword) {
            toast.error("Passwords not matching");
            return;
        }
        try{
            const response = await fetch(`${API_URL}/api/auth/signup`, {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({
                    name:(formData.firstname + " " + formData.lastname),
                    email: formData.email,
                    password: formData.password,
                }),
                credentials: "include",
            });
            const data = await response.json();
            if(response.ok){
                toast.success('Signup successfully');
                setIsLoggedin(true);
                navigate('/dashboard');
            }else{
                toast.error(data.error || 'Signup failed');
            }
        } catch(err) {
            console.log(err);
            toast.error("Server error")
        }
    }

    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    return (
        <div className="w-full">

            <form onSubmit={submitHandler} className="flex flex-col gap-4">
                <div className="flex gap-4">
                    <label className="w-full">
                        <p className="text-sm text-white mb-1">
                            First Name<sup className="text-red-500">*</sup>
                        </p>
                        <input
                            type="text"
                            name="firstname"
                            placeholder="Enter your first name"
                            required
                            onChange={changeHolder}
                            value={formData.firstname}
                            className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </label>
                    <label className="w-full">
                        <p className="text-sm text-white mb-1">
                            Last Name<sup className="text-red-500">*</sup>
                        </p>
                        <input
                            type="text"
                            name="lastname"
                            placeholder="Enter your last name"
                            required
                            onChange={changeHolder}
                            value={formData.lastname}
                            className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </label>
                </div>

                <label className="w-full">
                    <p className="text-sm text-white mb-1">
                        Email Address<sup className="text-red-500">*</sup>
                    </p>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        required
                        onChange={changeHolder}
                        value={formData.email}
                        className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                </label>

                <div className="flex gap-4">
                    <label className="w-full relative">
                        <p className="text-sm text-white mb-1">
                            Create Password<sup className="text-red-500">*</sup>
                        </p>
                        <input
                            type={showPassword1 ? "text" : "password"}
                            name="password"
                            placeholder="Choose password"
                            required
                            onChange={changeHolder}
                            value={formData.password}
                            className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        <span
                            onClick={() => setShowPassword1((prev) => !prev)}
                            className="absolute right-3 top-9 text-xl text-gray-300 cursor-pointer"
                        >
                            {showPassword1 ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </span>
                    </label>

                    <label className="w-full relative">
                        <p className="text-sm text-white mb-1">
                            Confirm Password<sup className="text-red-500">*</sup>
                        </p>
                        <input
                            type={showPassword2 ? "text" : "password"}
                            name="confirmpassword"
                            placeholder="Re-enter password"
                            required
                            onChange={changeHolder}
                            value={formData.confirmpassword}
                            className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        <span
                            onClick={() => setShowPassword2((prev) => !prev)}
                            className="absolute right-3 top-9 text-xl text-gray-300 cursor-pointer"
                        >
                            {showPassword2 ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </span>
                    </label>
                </div>

                <button
                    type="submit"
                    className="w-full bg-yellow-400 text-black font-semibold py-2 rounded-md hover:bg-yellow-500 transition-colors mt-2"
                >
                    Create Account
                </button>
            </form>
        </div>
    );
}

export default Signup;
