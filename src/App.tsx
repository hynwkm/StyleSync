import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";

import { useEffect, useState } from "react";
import Header from "./components/Header/Header";
import User from "./models/users";
import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import OutfitPage from "./pages/OutfitPage/OutfitPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import UserProfilePage from "./pages/UserProfilePage/UserProfilePage";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("token") ? true : false
    );
    const [userList, setUserList] = useState<User[]>([]);
    const [currentUserDetails, setCurrentUserDetails] = useState<User>();

    function setUsersList(users: User[]) {
        setUserList(users);
    }

    function login() {
        setIsLoggedIn(true);
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    return (
        <div className="App">
            <BrowserRouter>
                <Header isLoggedIn={isLoggedIn} />
                <Routes>
                    <Route
                        path="/"
                        element={
                            <LandingPage
                                isLoggedIn={isLoggedIn}
                                userList={userList}
                                setUserList={setUsersList}
                            />
                        }
                    />

                    <Route
                        path="/login"
                        element={<LoginPage login={login} />}
                    />
                    <Route
                        path="/signup"
                        element={<SignupPage login={login} />}
                    />
                    <Route path="/profile" element={<UserProfilePage />} />
                    <Route path="/outfits/:outfitId" element={<OutfitPage />} />
                </Routes>
            </BrowserRouter>
            {/* <Footer /> */}
        </div>
    );
}

export default App;
