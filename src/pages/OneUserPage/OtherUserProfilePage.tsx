import axios from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Outfits from "../../components/Outfits/Outfits";
import Outfit from "../../models/outfits";
import User from "../../models/users";
import fixUrl from "../../utils/fixUrl";
import "./OtherUserProfilePage.scss";

const API_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8080";

interface OtherUserProfilePageProps {}

const OtherUserProfilePage: React.FC<OtherUserProfilePageProps> = () => {
    const { userId } = useParams();
    const [otherUser, setOtherUser] = useState<User | null>(null);
    const [outfits, setOutfits] = useState<Outfit[]>([]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    useEffect(() => {
        const getOtherUserProfile = async () => {
            try {
                const response = await axios.get<User>(
                    fixUrl(API_URL, `api/user/${userId}`)
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

    useEffect(() => {
        const fetchOutfits = async () => {
            try {
                if (userId) {
                    const response = await axios.get<Outfit[]>(
                        fixUrl(API_URL, `api/user/${userId}/outfits`)
                    );
                    setOutfits(response.data);
                } else {
                    console.log("no user id");
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchOutfits();
    }, [userId]);

    if (!otherUser) {
        return <div>Loading user info...</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <div className="content profile">
                <div className="profile__header">
                    <div className="profile__user-rating">
                        <h2>Welcome to {otherUser.username}'s Wardrobe</h2>
                        <p>
                            Rating: {otherUser.rating ? otherUser.rating : "0"}
                            /5
                        </p>
                    </div>
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
                    <div className="profile__columns">
                        <div className="column">
                            <div className="profile__detail">
                                <strong>Username: </strong>
                                {otherUser.username}
                            </div>
                            <div className="profile__detail">
                                <strong>Date of Birth: </strong>
                                {otherUser.dob}
                            </div>
                            <div className="profile__detail">
                                <strong>Shopping For: </strong>
                                {!otherUser.gender
                                    ? "All"
                                    : otherUser.gender === "Male"
                                    ? "Men's"
                                    : "Women's"}
                            </div>
                        </div>
                        <div className="column">
                            <div className="profile__detail">
                                <strong>Height(cm): </strong>
                                {otherUser.height}
                            </div>
                            <div className="profile__detail">
                                <strong>Weight(kg): </strong>
                                {otherUser.weight}
                            </div>
                            <div className="profile__detail">
                                <strong>Outfit Budget($): </strong>
                                {otherUser.budget}
                            </div>
                        </div>
                    </div>
                    <div className="profile__detail profile__detail--bio">
                        <strong>Bio: </strong>
                        <div>{otherUser.bio}</div>
                    </div>
                </div>
            </div>
            <Outfits outfits={outfits} currentUser={false} favPage={false} />
        </motion.div>
    );
};

export default OtherUserProfilePage;
