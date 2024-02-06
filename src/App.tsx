import { BrowserRouter } from "react-router-dom";

import { useEffect, useState } from "react";
import "./App.scss";
import Header from "./components/Header/Header";
import RoutesComponent from "./components/RoutesComponent/RoutesComponent";
import User from "./models/users";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("token") ? true : false
    );
    const [userList, setUserList] = useState<User[]>([]);

    function setUsersList(users: User[]) {
        setUserList(users);
    }
    function login() {
        setIsLoggedIn(true);
    }
    function logout() {
        setIsLoggedIn(false);
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);
    return (
        <div className="App">
            <BrowserRouter>
                <Header isLoggedIn={isLoggedIn} logout={logout} />
                <RoutesComponent
                    isLoggedIn={isLoggedIn}
                    login={login}
                    userList={userList}
                    setUsersList={setUsersList}
                />
            </BrowserRouter>
        </div>
    );
}

export default App;
