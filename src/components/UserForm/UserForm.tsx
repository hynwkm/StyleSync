import { SetStateAction, useState } from "react";

export default function UserForm() {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    function usernameChangeHandler(e: {
        username: { value: SetStateAction<undefined> };
    }) {
        setUsername(e.username.value);
    }
    function passwordChangeHandler(e: {
        password: { value: SetStateAction<undefined> };
    }) {
        setPassword(e.password.value);
    }

    function submitHandler() {}
    return (
        <form onSubmit={submitHandler}>
            <h1>User Signup</h1>
            {/* <label htmlFor="username">
                <input
                    type="text"
                    name="username"
                    onChange={usernameChangeHandler}
                    value={username}
                />
            </label>
            <label htmlFor="password">
                <input
                    type="password"
                    name="password"
                    onChange={passwordChangeHandler}
                    value={password}
                />
            </label>
            <button type="submit" /> */}
        </form>
    );
}
