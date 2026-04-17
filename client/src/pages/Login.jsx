import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import toast from 'react-hot-toast';

const Login = () => {

    const { showUserLogin, navigate, setShowUserLogin, axios, fetchUser } =
        useContext(ShopContext);

    const [state, setState] = useState("login");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // ✅ clear fields function
    const clearFields = () => {
        setName("");
        setEmail("");
        setPassword("");
    };

    // ✅ submit handler
    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {

            const endpoint = `/api/user/${state}`;

            const payload = {
                name,
                email,
                password
            };

            const { data } = await axios.post(endpoint, payload);

            if (!data.success) {
                toast.error(data.message);
                return;
            }

            // ✅ LOGIN
            if (state === "login") {

                toast.success("Login successful");

                await fetchUser();

                navigate("/");

                setShowUserLogin(false);

                clearFields();

                return;
            }

            // ✅ REGISTER
            if (state === "register") {

                toast.success(
                    "Account created successfully. Please login."
                );

                setState("login");

                clearFields();
            }

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Something went wrong"
            );
        }
    };


    return (
        <div
            onClick={() => setShowUserLogin(false)}
            className='fixed top-0 bottom-0 left-0 right-0 z-40 flex items-center text-sm text-gray-600 bg-black/50'
        >

            <form
                onSubmit={onSubmitHandler}
                onClick={(e) => e.stopPropagation()}
                className='flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[325px] rounded-lg shadow-xl border border-gray-200 bg-white'
            >

                <h3 className='bold-28 mx-auto mb-3'>
                    <span className='text-secondary capitalize'>
                        User
                    </span>{" "}
                    <span className='capitalize'>
                        {state === "login" ? "Login" : "Register"}
                    </span>
                </h3>


                {/* NAME */}
                {state === "register" && (
                    <div className='w-full'>
                        <p>Name</p>
                        <input
                            type='text'
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder='Type here...'
                            className='border rounded w-full p-2 mt-1'
                            required
                        />
                    </div>
                )}


                {/* EMAIL */}
                <div className='w-full'>
                    <p>Email</p>
                    <input
                        type='email'
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        placeholder='Type here...'
                        className='border rounded w-full p-2 mt-1'
                        required
                    />
                </div>


                {/* PASSWORD */}
                <div className='w-full'>
                    <p>Password</p>
                    <input
                        type='password'
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        placeholder='Type here...'
                        className='border rounded w-full p-2 mt-1'
                        required
                    />
                </div>


                {/* SWITCH */}
                {state === "register" ? (
                    <p>
                        Already have account ?
                        <span
                            className='text-secondary cursor-pointer'
                            onClick={() => {
                                setState("login");
                                clearFields();
                            }}
                        >
                            {" "}
                            Login
                        </span>
                    </p>
                ) : (
                    <p>
                        Create account ?
                        <span
                            className='text-secondary cursor-pointer'
                            onClick={() => {
                                setState("register");
                                clearFields();
                            }}
                        >
                            {" "}
                            Register
                        </span>
                    </p>
                )}


                <button
                    type='submit'
                    className='btn-secondary w-full rounded !py-2.5'
                >
                    {state === "register"
                        ? "Create Account"
                        : "Login"}
                </button>

            </form>

        </div>
    );
};

export default Login;
