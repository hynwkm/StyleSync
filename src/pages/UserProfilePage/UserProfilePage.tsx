import axios from "axios";
import React, { useEffect, useState } from "react";
import Outfits from "../../components/Outfits/Outfits";
import User from "../../models/users";
import "./UserProfilePage.scss";

const API_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8080";

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
            // Create a temporary URL for the selected file
            const fileURL = URL.createObjectURL(file);

            // Update formData state instead of profile
            setFormData((prevFormData) => ({
                ...prevFormData,
                profile_pic: fileURL, // Update the profile_pic property with the temporary URL
            }));
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

        let updatedFormData = formData; // Start with existing form data
        if (fileInputRef.current?.files?.[0]) {
            const file = fileInputRef.current.files[0];
            const reader = new FileReader();

            try {
                const encodedImage = await new Promise((resolve, reject) => {
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = () => reject(reader.error);
                    reader.readAsDataURL(file);
                });

                if (typeof encodedImage === "string") {
                    updatedFormData = {
                        ...formData,
                        profile_pic: encodedImage,
                    };
                }
            } catch (error) {
                console.error("Error processing file:", error);
                return; // Exit the function if file processing fails
            }
        }

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

            // Update state with the response
            setProfile(profileUpdateResponse.data);
            setFormData(profileUpdateResponse.data);
            setOriginalFormData(profileUpdateResponse.data);
            setReadOnly(true);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    if (!profile) {
        return <div>Loading profile...</div>;
    }

    return (
        <>
            {" "}
            <form className="content profile" onSubmit={handleSubmit}>
                <div className="profile__header">
                    <h2>Welcome back, {profile.username}</h2>
                    <p>Rating is: {profile.rating ? profile.rating : "0"}/5</p>
                    <div className="profile__picture-wrapper">
                        <div className="profile__image-container">
                            {formData.profile_pic ? (
                                <img
                                    src={formData.profile_pic}
                                    alt="Profile"
                                    className="profile__image"
                                />
                            ) : (
                                <div className="profile__image profile__image--empty" />
                            )}
                        </div>
                        <label
                            htmlFor="profile_pic"
                            className={`profile__image-label ${
                                readOnly ? "readonly readonly--pic" : ""
                            }`}>
                            Choose a Profile Picture
                            <input
                                type="file"
                                name="profile_pic"
                                className={`profile__image-input ${
                                    readOnly ? "readonly readonly--pic" : ""
                                }`}
                                id="profile_pic"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                disabled={readOnly}
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
            <Outfits />
        </>
    );
};

export default UserProfilePage;
