import axios from "axios";
import { motion } from "framer-motion";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import fixUrl from "../../utils/fixUrl";
import "./LoginPage.scss";

const API_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8080";

export default function LoginPage(props: { login: () => void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const navigate = useNavigate();

    function changeEmail(e: React.ChangeEvent<HTMLInputElement>): void {
        setEmailError(false);
        setEmail(e.target.value);
    }
    function changePassword(e: React.ChangeEvent<HTMLInputElement>): void {
        setPasswordError(false);

        setPassword(e.target.value);
    }
    const submitHandler = async (
        e: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
        setEmailError(false);
        setPasswordError(false);
        setErrorMsg("");

        if (!email) {
            setEmailError(true);
            setErrorMsg("Please enter a valid email");
            return;
        }
        if (!password) {
            setPasswordError(true);
            setErrorMsg("Please enter a valid password");
            return;
        }

        try {
            const response = await axios.post(fixUrl(API_URL, `api/login`), {
                email,
                password,
            });
            const token = response.data.token;
            localStorage.setItem("token", token);
            props.login();
            setErrorMsg("Sign In Success!");
            setTimeout(() => navigate("/discover"), 2000);
        } catch (error) {
            console.error(error);
            let message = "An unexpected error occurred";
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    message =
                        error.response.data ||
                        "Login failed. Please try again.";
                } else if (error.request) {
                    message =
                        "No response from server. Please check your network.";
                }
            }
            setErrorMsg(message);
            setEmailError(true);
            setPasswordError(true);
            console.error(error);
        }
    };

    function toSignup(): void {
        navigate("/signup");
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <div className="content login">
                <form className="login__form" onSubmit={submitHandler}>
                    <h2>LOGIN</h2>
                    <label className="login__label" htmlFor="email">
                        Email:
                        <input
                            className={`login__input ${
                                emailError ? "login__input--error" : ""
                            }`}
                            type="text"
                            value={email}
                            onChange={(e) => changeEmail(e)}
                        />
                    </label>
                    <label className="login__label" htmlFor="password">
                        Password:
                        <input
                            className={`login__input ${
                                passwordError ? "login__input--error" : ""
                            }`}
                            type="password"
                            value={password}
                            onChange={(e) => changePassword(e)}
                        />
                    </label>
                    <button className="login__submit" type="submit">
                        LOGIN
                    </button>
                    {errorMsg ? <p>{errorMsg}</p> : <></>}
                    <div className="login__signup" onClick={toSignup}>
                        Click here to Create an Account
                    </div>
                </form>
            </div>
        </motion.div>
    );
}
