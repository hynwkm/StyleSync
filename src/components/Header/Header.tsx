import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.scss";

export default function Header(props: {
    isLoggedIn: boolean;
    logout: () => void;
}) {
    const [logoutShown, setLogoutShown] = useState(false);

    const navigate = useNavigate();
    function toHome(): void {
        navigate("/");
    }
    function toLogin(e: React.MouseEvent): void {
        e.stopPropagation();
        navigate("/login");
    }
    function toProfile(e: React.MouseEvent): void {
        e.stopPropagation();
        navigate("/profile");
    }
    function toLogout(e: React.MouseEvent): void {
        e.stopPropagation();
        localStorage.removeItem("token");
        props.logout();
        navigate("/");
    }
    function toFavorites(e: React.MouseEvent): void {
        e.stopPropagation();
        navigate("/favorites");
    }

    function showLogout() {
        setLogoutShown(true);
    }
    function hideLogout() {
        setLogoutShown(false);
    }
    return (
        <header className="header">
            <h1 className="header__logo" onClick={toHome}>
                Style Fit
            </h1>
            {props.isLoggedIn ? (
                <>
                    <div className="header__actions" onMouseOut={hideLogout}>
                        <p
                            className="header__login"
                            onClick={toProfile}
                            onMouseEnter={showLogout}>
                            My Profile
                        </p>
                        <p
                            className={`header__favorites ${
                                logoutShown ? "header__favorites--shown" : ""
                            }`}
                            onClick={toFavorites}
                            onMouseEnter={showLogout}
                            onMouseLeave={hideLogout}>
                            Favorites
                        </p>
                        <p
                            className={`header__logout ${
                                logoutShown ? "header__logout--shown" : ""
                            }`}
                            onClick={toLogout}
                            onMouseEnter={showLogout}
                            onMouseLeave={hideLogout}>
                            Logout
                        </p>
                    </div>
                    {/* <div>View Favorites</div> */}
                </>
            ) : (
                <p className="header__login" onClick={toLogin}>
                    Sign In
                </p>
            )}
        </header>
    );
}
