import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import User from "../../models/users";
import FavPage from "../../pages/FavPage/FavPage";
import LandingPage from "../../pages/LandingPage/LandingPage";
import LoginPage from "../../pages/LoginPage/LoginPage";
import MainPage from "../../pages/MainPage/MainPage";
import OtherUserProfilePage from "../../pages/OneUserPage/OtherUserProfilePage";
import SignupPage from "../../pages/SignupPage/SignupPage";
import UserProfilePage from "../../pages/UserProfilePage/UserProfilePage";

interface RoutesComponentProps {
    isLoggedIn: boolean;
    login: () => void;
    userList: User[];
    setUsersList: (users: User[]) => void;
}

const RoutesComponent: React.FC<RoutesComponentProps> = ({
    isLoggedIn,
    login,
    userList,
    setUsersList,
}) => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
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
                <Route path="/login" element={<LoginPage login={login} />} />
                <Route path="/signup" element={<SignupPage login={login} />} />
                <Route path="/profile" element={<UserProfilePage />} />
                <Route
                    path="/user/:userId"
                    element={<OtherUserProfilePage />}
                />
                <Route
                    path="/discover"
                    element={
                        <MainPage
                            isLoggedIn={isLoggedIn}
                            userList={userList}
                            setUserList={setUsersList}
                        />
                    }
                />
                <Route
                    path="/favorites"
                    element={<FavPage isLoggedIn={isLoggedIn} />}
                />
            </Routes>
        </AnimatePresence>
    );
};

export default RoutesComponent;
