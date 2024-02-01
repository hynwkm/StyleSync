import axios from "axios";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.scss";

const API_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8080";

export default function LoginPage() {
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
            const response = await axios.get(`${API_URL}/api/login`);
            const token = response.data.token;
            localStorage.setItem("token", token);
            navigate("/");
        } catch (error) {
            let message = "An unexpected error occurred"; // Default error message
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    message =
                        error.response.data.message ||
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
    );
}
