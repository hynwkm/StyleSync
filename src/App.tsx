import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";

import { useState } from "react";
import Header from "./components/Header/Header";
import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import OutfitPage from "./pages/OutfitPage/OutfitPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import UserProfilePage from "./pages/UserProfilePage/UserProfilePage";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <div className="App">
            <BrowserRouter>
                <Header isLoggedIn={isLoggedIn} />
                <Routes>
                    <Route
                        path="/"
                        element={<LandingPage isLoggedIn={isLoggedIn} />}
                    />
                    <Route path="/outfits/:outfitId" element={<OutfitPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/user" element={<UserProfilePage />} />
                    <Route path="/signup" element={<SignupPage />} />
                </Routes>
            </BrowserRouter>
            {/* <Footer /> */}
        </div>
    );
}

export default App;
