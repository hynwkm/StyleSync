import axios from "axios";
import { motion } from "framer-motion";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import fixUrl from "../../utils/fixUrl";
import "./SignupPage.scss";

const API_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8080";

export default function SignupPage(props: { login: () => void }) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);

    const navigate = useNavigate();

    function changeEmail(e: React.ChangeEvent<HTMLInputElement>): void {
        setEmailError(false);
        setEmail(e.target.value);
    }
    function changeUsername(e: React.ChangeEvent<HTMLInputElement>): void {
        setUsernameError(false);
        setUsername(e.target.value);
    }

    function changePassword(e: React.ChangeEvent<HTMLInputElement>): void {
        setPasswordError(false);
        setConfirmPasswordError(false);
        setPassword(e.target.value);
    }

    function changeConfirmPassword(
        e: React.ChangeEvent<HTMLInputElement>
    ): void {
        setConfirmPasswordError(false);
        setConfirmPassword(e.target.value);
    }

    const submitHandler = async (
        e: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
        setEmailError(false);
        setUsernameError(false);
        setPasswordError(false);
        setConfirmPasswordError(false);
        setErrorMsg("");
        if (!email) {
            setEmailError(true);
            setErrorMsg("Please enter a valid email");
            return;
        }
        if (!username) {
            setEmailError(true);
            setErrorMsg("Please enter a valid username");
            return;
        }
        if (!password) {
            setPasswordError(true);
            setErrorMsg("Please enter a strong password");
            return;
        }
        if (password !== confirmPassword) {
            setConfirmPasswordError(true);
            setErrorMsg("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post(fixUrl(API_URL, "api/signup"), {
                email,
                username,
                password,
            });
            const token = response.data.token;
            localStorage.setItem("token", token);
            props.login();
            setErrorMsg("Sign up Success!");
            setTimeout(() => navigate("/"), 2000);
        } catch (error) {
            console.log(error);
            let message = "An unexpected error occurred";
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    message =
                        error.response.data ||
                        "Signup failed. Please try again.";
                } else if (error.request) {
                    message =
                        "No response from server. Please check your network.";
                }
            }
            setErrorMsg(message);
            setEmailError(true);
            setUsernameError(true);
            setPasswordError(true);
            setConfirmPasswordError(true);
            console.error(error);
        }
    };

    function toLogin(): void {
        navigate("/login");
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <div className="content signup">
                <form className="signup__form" onSubmit={submitHandler}>
                    <h2>SIGN UP</h2>
                    <label className="signup__label" htmlFor="email">
                        Email:
                        <input
                            className={`signup__input ${
                                emailError ? "signup__input--error" : ""
                            }`}
                            type="text"
                            value={email}
                            onChange={changeEmail}
                        />
                    </label>
                    <label className="signup__label" htmlFor="username">
                        Username:
                        <input
                            className={`signup__input ${
                                usernameError ? "signup__input--error" : ""
                            }`}
                            type="text"
                            value={username}
                            onChange={changeUsername}
                        />
                    </label>
                    <label className="signup__label" htmlFor="password">
                        Password:
                        <input
                            className={`signup__input ${
                                passwordError ? "signup__input--error" : ""
                            }`}
                            type="password"
                            value={password}
                            onChange={changePassword}
                        />
                    </label>
                    <label className="signup__label" htmlFor="confirmPassword">
                        Confirm Password:
                        <input
                            className={`signup__input ${
                                confirmPasswordError
                                    ? "signup__input--error"
                                    : ""
                            }`}
                            type="password"
                            value={confirmPassword}
                            onChange={changeConfirmPassword}
                        />
                    </label>
                    <button className="signup__submit" type="submit">
                        SIGN UP
                    </button>
                    {errorMsg ? <p>{errorMsg}</p> : <></>}
                    <div className="signup__login" onClick={toLogin}>
                        Already have an account? Click here to log in
                    </div>
                </form>
            </div>
        </motion.div>
    );
}
