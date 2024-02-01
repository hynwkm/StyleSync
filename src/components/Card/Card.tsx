import User from "../../models/users";
import "./Card.scss";

export default function Card(prop: { cardDetails: User }) {
    return (
        <div className="card">
            {/* image of a person */}
            <img
                className="card__image"
                src={prop.cardDetails.profile_pic}
                alt="profile_pic"
            />
        </div>
    );
}
