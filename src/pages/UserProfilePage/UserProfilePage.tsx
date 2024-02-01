import axios from "axios";
import { useEffect, useState } from "react";
import User from "../../models/users";
import "./UserProfilePage.scss";

const API_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8080";

// If there are no props needed, you can omit this part or extend it in the future
interface UserProfilePageProps {}

const UserProfilePage: React.FC<UserProfilePageProps> = () => {
    const [profile, setProfile] = useState<User | null>(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await axios.get<User>(
                    `${API_URL}/api/profile`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setProfile(response.data);
                console.log(response.data.profile_pic);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            }
        };
        getProfile();
    }, [token]);

    if (!profile) {
        return <div>Loading profile...</div>;
    }

    return (
        <div className="content profile">
            <div className="profile__header">
                <h2>Welcome back, {profile.username}</h2>
                <p>&#9734; {profile.rating ? profile.rating : "0"}</p>
                {profile.profile_pic ? (
                    <img
                        src={profile.profile_pic}
                        alt="Profile"
                        className="profile__image"
                    />
                ) : (
                    <label
                        htmlFor="profile_pic"
                        className="profile__image-label">
                        Choose a Profile Picture
                        <input
                            type="file"
                            name="profile_pic"
                            className="profile__image-input"
                            id="profile_pic"
                        />
                    </label>
                )}
            </div>
            <form className="profile__form">
                <div className="profile__columns">
                    <div className="column">
                        <div className="profile__detail">
                            <label htmlFor="email">
                                <strong>Email:</strong>
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={profile.email}
                                readOnly
                            />
                        </div>
                        <div className="profile__detail">
                            <label htmlFor="dob">
                                <strong>Date of Birth:</strong>
                            </label>
                            <input
                                type="text"
                                id="dob"
                                value={profile.dob}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="column">
                        <div className="profile__detail">
                            <label htmlFor="gender">
                                <strong>Gender:</strong>
                            </label>
                            <input
                                type="text"
                                id="gender"
                                value={profile.gender}
                                readOnly
                            />
                        </div>
                        {/* More user details can be added here with profile__detail class for the second column */}
                    </div>
                </div>
                {/* Additional form elements like submit button if needed */}
            </form>
        </div>
    );
};

export default UserProfilePage;
