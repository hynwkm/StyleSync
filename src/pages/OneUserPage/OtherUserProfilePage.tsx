import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Outfits from "../../components/Outfits/Outfits";
import User from "../../models/users";
import "./OtherUserProfilePage.scss";

const API_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8080";

interface OtherUserProfilePageProps {}

const OtherUserProfilePage: React.FC<OtherUserProfilePageProps> = () => {
    const { userId } = useParams();
    const [otherUser, setOtherUser] = useState<User | null>(null);

    useEffect(() => {
        const getOtherUserProfile = async () => {
            try {
                const response = await axios.get<User>(
                    `${API_URL}/api/user/${userId}`
                );
                const userData = {
                    id: response.data.id,
                    email: response.data.email,
                    profile_visibility: response.data.profile_visibility,
                    username: response.data.username || "",
                    dob:
                        new Date(response.data.dob).toLocaleDateString(
                            "en-CA",
                            {
                                // Using Canadian locale as an example to get YYYY-MM-DD format
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                            }
                        ) || "",
                    gender: response.data.gender || "",
                    height: response.data.height || 0,
                    weight: response.data.weight || 0,
                    rating: response.data.rating || 0,
                    budget: response.data.budget || 0,
                    bio: response.data.bio || "",
                    profile_pic: response.data.profile_pic || "",
                };
                setOtherUser(userData);
            } catch (error) {}
        };
        getOtherUserProfile();
    }, [userId]);

    if (!otherUser) {
        return <div>Loading user info...</div>;
    }

    return (
        <>
            <div className="content profile">
                <div className="profile__header">
                    <h2>Welcome to {otherUser.username}'s Wardrobe</h2>
                    <p>Rating: {otherUser.rating ? otherUser.rating : "0"}/5</p>
                    <div className="profile__picture-wrapper">
                        <div className="profile__image-container">
                            {otherUser.profile_pic ? (
                                <img
                                    src={otherUser.profile_pic}
                                    alt="Profile"
                                    className="profile__image"
                                />
                            ) : (
                                <div className="profile__image profile__image--empty" />
                            )}
                        </div>
                    </div>
                </div>
                <div className="profile__form">
                    <div className="profile__detail">
                        <strong>Username: </strong>
                        {otherUser.username}
                    </div>
                    <div className="profile__detail">
                        <strong>Date of Birth: </strong>
                        {otherUser.dob}
                    </div>
                    <div className="profile__detail">
                        <strong>Gender: </strong>
                        {otherUser.gender}
                    </div>
                    <div className="profile__detail">
                        <strong>Height: </strong>
                        {otherUser.height} cm
                    </div>
                    <div className="profile__detail">
                        <strong>Weight: </strong>
                        {otherUser.weight} kg
                    </div>
                    <div className="profile__detail">
                        <strong>Budget: </strong>${otherUser.budget}
                    </div>
                    <div className="profile__detail">
                        <strong>Bio: </strong>
                        {otherUser.bio}
                    </div>
                </div>
            </div>
            <Outfits userId={userId} />
        </>
    );
};

export default OtherUserProfilePage;
