import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function Login({ setIsLoggedin }) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);

    function changeHandler(event) {
        setFormData((prev) => ({
            ...prev,
            [event.target.name]: event.target.value
        }));
    }

    async function submitHandler(event) {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:8000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Login successful!");
                setIsLoggedin(true);
                navigate("/dashboard");
            } else {
                toast.error(data.error || "Login failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Server error");
        }
    }

    return (
        <form onSubmit={submitHandler} className="flex flex-col gap-4 w-full mt-6">
            <label className="w-full">
                <p className="text-sm text-white mb-1">
                    Email Address<sup className="text-red-500">*</sup>
                </p>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Enter email address"
                    required
                    onChange={changeHandler}
                    className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
            </label>

            <label className="w-full">
                <p className="text-sm text-white mb-1">
                    Password<sup className="text-red-500">*</sup>
                </p>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        placeholder="Enter Password"
                        required
                        onChange={changeHandler}
                        className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <span
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-300 cursor-pointer"
                    >
                        {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </span>
                </div>
            </label>

            <div className="flex justify-end -mt-2">
                <Link to="#" className="text-sm text-blue-400 hover:underline">
                    Forgot Password?
                </Link>
            </div>

            <button
                type="submit"
                className="bg-yellow-400 text-black font-semibold py-2 rounded-md hover:bg-yellow-500 transition-colors mt-2"
            >
                Sign In
            </button>
        </form>
    );
}

export default Login;
