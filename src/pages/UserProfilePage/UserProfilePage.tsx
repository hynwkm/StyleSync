import axios from "axios";
import React, { useEffect, useState } from "react";
import User from "../../models/users";
import "./UserProfilePage.scss";

const PROXY_URL = "https://cors-anywhere.herokuapp.com/";
const API_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8080";
const IMG_API_URL =
    process.env.REACT_APP_IMG_API_URL || "https://freeimage.host/api/1/upload";
const IMG_API_KEY =
    process.env.REACT_APP_IMG_API_KEY || "6d207e02198a847aa98d0a2a901485a5";

// If there are no props needed, you can omit this part or extend it in the future
interface UserProfilePageProps {}

const UserProfilePage: React.FC<UserProfilePageProps> = () => {
    const [profile, setProfile] = useState<User | null>(null);
    const [originalFormData, setOriginalFormData] = useState({
        username: "",
        dob: "",
        gender: "",
        height: 0,
        weight: 0,
        budget: 0,
        rating: 0,
        bio: "",
        profile_pic: "",
        profile_visibility: false,
    });
    const [formData, setFormData] = useState({ ...originalFormData });
    const [readOnly, setReadOnly] = useState<boolean>(true);

    const token = localStorage.getItem("token");
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await axios.get<User>(
                    `${API_URL}/api/profile`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const profileData = {
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
                    profile_visibility:
                        response.data.profile_visibility || false,
                };
                setProfile(response.data);
                setFormData(profileData);
                setOriginalFormData(profileData);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            }
        };
        getProfile();
    }, [token]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
        >
    ) => {
        const target = e.target as HTMLInputElement; // Safely assume all inputs have common properties
        let value: string | number | boolean = target.value;

        // Handle different input types explicitly
        if (target.type === "checkbox") {
            value = target.checked;
        } else if (target.type === "number") {
            value = parseFloat(target.value) || 0; // Ensure value is always numeric
        } // No need to handle 'string' explicitly as it's the default type of value

        const name = target.name;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            const fileURL = URL.createObjectURL(file);
            setProfile((prevProfile) => {
                if (prevProfile === null) {
                    return null;
                } else {
                    return {
                        ...prevProfile,
                        profile_pic: fileURL,
                    };
                }
            });
        }
    };
    function editProfile(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.stopPropagation();
        if (readOnly) {
            setReadOnly(false);
        } else {
            setFormData(originalFormData);
            setReadOnly(true);
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (fileInputRef.current?.files?.[0]) {
            const file = fileInputRef.current.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                try {
                    const encodedImage = reader.result;
                    if (typeof encodedImage === "string") {
                        const formData = new FormData();
                        formData.append("key", IMG_API_KEY);
                        formData.append("action", "upload");
                        formData.append("source", encodedImage);
                        formData.append("format", "json");

                        const uploadResponse = await axios.post(
                            `${PROXY_URL}${IMG_API_URL}`,
                            formData,
                            {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                },
                            }
                        );

                        // Assuming the API returns the URL of the uploaded image in the response body
                        const imageUrl = uploadResponse.data.data.image.url;

                        // Update the profile picture URL in your form data before submitting the profile update
                        const updatedFormData = {
                            ...formData,
                            profile_pic: imageUrl,
                        };

                        // Submit the updated profile data
                        // Ensure you have the correct URL and headers for your profile update API call
                        try {
                            const profileUpdateResponse = await axios.put(
                                `${API_URL}/api/profile`,
                                updatedFormData,
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                }
                            );
                            setProfile(profileUpdateResponse.data);
                            setFormData(profileUpdateResponse.data);
                            setOriginalFormData(profileUpdateResponse.data);
                            setReadOnly(true);
                        } catch (profileUpdateError) {
                            console.error(
                                "Error updating profile:",
                                profileUpdateError
                            );
                        }
                    }
                } catch (uploadError) {
                    console.error("Error uploading image:", uploadError);
                }
            };
            reader.onerror = () => {
                console.error("Error reading file:", reader.error);
            };
        } else {
            console.log("No file selected.");
        }
    };

    if (!profile) {
        return <div>Loading profile...</div>;
    }

    return (
        <form className="content profile" onSubmit={handleSubmit}>
            {/* Profile Header */}
            <div className="profile__header">
                <h2>Welcome back, {profile.username}</h2>
                <p>Rating is: {profile.rating ? profile.rating : "0"}/5</p>
                <div className="profile__picture-wrapper">
                    <div className="profile__image-container">
                        {profile.profile_pic ? (
                            <img
                                src={profile.profile_pic}
                                alt="Profile"
                                className="profile__image"
                            />
                        ) : (
                            <div className="profile__image"></div>
                        )}
                        <img
                            src={profile.profile_pic}
                            alt="Profile"
                            className="profile__image"
                        />
                    </div>
                    <label
                        htmlFor="profile_pic"
                        className="profile__image-label">
                        Choose a Profile Picture
                        <input
                            type="file"
                            name="profile_pic"
                            className="profile__image-input"
                            id="profile_pic"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </label>
                </div>
            </div>
            <div className="profile__form">
                <div className="profile__columns">
                    <div className="column">
                        <div className="profile__detail">
                            <label htmlFor="username">
                                <strong>Username: </strong>
                            </label>
                            <input
                                type="username"
                                id="username"
                                name="username"
                                className={`${readOnly ? "readonly" : ""}`}
                                value={formData.username}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />
                        </div>
                        <div className="profile__detail">
                            <label htmlFor="dob">
                                <strong>Date of Birth: </strong>
                            </label>
                            <input
                                type="date"
                                id="dob"
                                name="dob"
                                className={`${readOnly ? "readonly" : ""}`}
                                value={formData.dob}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />
                        </div>
                        <div className="profile__detail">
                            <label htmlFor="gender">
                                <strong>Gender: </strong>
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                className={`${readOnly ? "readonly" : ""}`}
                                value={formData.gender}
                                onChange={handleChange}
                                disabled={readOnly}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="">Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="column">
                        <div className="profile__detail">
                            <label htmlFor="height">
                                <strong>Height (cm): </strong>
                            </label>
                            <input
                                type="number"
                                id="height"
                                name="height"
                                className={`${readOnly ? "readonly" : ""}`}
                                value={formData.height}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />
                        </div>
                        <div className="profile__detail">
                            <label htmlFor="weight">
                                <strong>Weight (kg): </strong>
                            </label>
                            <input
                                type="number"
                                id="weight"
                                name="weight"
                                className={`${readOnly ? "readonly" : ""}`}
                                value={formData.weight}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />
                        </div>
                        <div className="profile__detail">
                            <label htmlFor="budget">
                                <strong>Budget ($): </strong>
                            </label>
                            <input
                                type="number"
                                id="budget"
                                name="budget"
                                className={`${readOnly ? "readonly" : ""}`}
                                value={formData.budget}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />
                        </div>
                    </div>
                </div>
                <div className="profile__detail">
                    <label htmlFor="bio">
                        <strong>Bio: </strong>
                    </label>
                    <textarea
                        id="bio"
                        name="bio"
                        className={`profile__text-area ${
                            readOnly ? "readonly" : ""
                        }`}
                        value={formData.bio}
                        onChange={handleChange}
                        readOnly={readOnly}></textarea>
                </div>
                <div className="profile__detail">
                    <input
                        type="checkbox"
                        id="profile_visibility"
                        name="profile_visibility"
                        className={`${readOnly ? "readonly" : ""}`}
                        checked={formData.profile_visibility}
                        onChange={handleChange}
                        disabled={readOnly}
                    />
                    <label htmlFor="profile_visibility">
                        <strong>Profile Visibility</strong>
                    </label>
                </div>
                {readOnly ? (
                    <button
                        className="profile__button profile__button--edit"
                        onClick={editProfile}>
                        Edit Profile
                    </button>
                ) : (
                    <>
                        <button
                            type="submit"
                            className="profile__button profile__button--save">
                            Save Profile
                        </button>
                        <button
                            className="profile__button profile__button--cancel"
                            onClick={editProfile}>
                            Cancel
                        </button>
                    </>
                )}
            </div>
        </form>
    );
};

export default UserProfilePage;
