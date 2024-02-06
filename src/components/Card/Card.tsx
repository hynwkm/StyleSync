import { useNavigate } from "react-router-dom";
import User from "../../models/users";
import "./Card.scss";

export default function Card(prop: { cardDetails: User; userId: number }) {
    const navigate = useNavigate();
    function toUserPage() {
        navigate(`/user/${prop.userId}`);
    }
    return (
        <div className="card" onClick={toUserPage}>
            {prop.cardDetails.profile_pic ? (
                <img
                    className="card__image"
                    src={prop.cardDetails.profile_pic}
                    alt="profile_pic"
                />
            ) : (
                <div className="card__placeholder">
                    {prop.cardDetails.username}
                </div>
            )}
        </div>
    );
}
