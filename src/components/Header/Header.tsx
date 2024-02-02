import { useNavigate } from "react-router-dom";
import "./Header.scss";

export default function Header(props: { isLoggedIn: boolean }) {
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
    return (
        <header className="header" onClick={toHome}>
            <h1 className="header__logo">Style Sync</h1>
            {props.isLoggedIn ? (
                <p className="header__login" onClick={toProfile}>
                    My Profile
                </p>
            ) : (
                <p className="header__login" onClick={toLogin}>
                    Login
                </p>
            )}
        </header>
    );
}
