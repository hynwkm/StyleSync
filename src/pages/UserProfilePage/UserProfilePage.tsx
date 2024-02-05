import axios from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Outfits from "../../components/Outfits/Outfits";
import Outfit from "../../models/outfits";
import User from "../../models/users";
import "./UserProfilePage.scss";

const API_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8080";

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
    const [outfits, setOutfits] = useState<Outfit[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const token = localStorage.getItem("token");
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const getProfile = async () => {
            if (!token) {
                return;
            }
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

    useEffect(() => {
        const fetchOutfits = async () => {
            if (!token) {
                return;
            }
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get<Outfit[]>(
                    `${API_URL}/api/profile/outfits`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setOutfits(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchOutfits();
    }, [token]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
        >
    ) => {
        const target = e.target as HTMLInputElement;
        let value: string | number | boolean = target.value;

        if (target.type === "checkbox") {
            value = target.checked;
        } else if (target.type === "number") {
            value = parseFloat(target.value) || 0;
        }

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

            setFormData((prevFormData) => ({
                ...prevFormData,
                profile_pic: fileURL,
            }));
        }
    };
    function editProfile(e: React.MouseEvent<SVGElement>) {
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

        let updatedFormData = formData;
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
                return;
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

            setProfile(profileUpdateResponse.data);
            setFormData(profileUpdateResponse.data);
            setOriginalFormData(profileUpdateResponse.data);
            setReadOnly(true);
            navigate("/profile");
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };
    const handleAddOutfit = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true);
        const file = e.target.files ? e.target.files[0] : null;

        if (file) {
            const reader = new FileReader();
            let encodedImage;

            try {
                encodedImage = await new Promise((resolve, reject) => {
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = (error) => reject(error);
                    reader.readAsDataURL(file);
                });
            } catch (error) {
                console.error("Error reading file:", error);
                setLoading(false);
                return;
            }
            try {
                const addOutfitResponse = await axios.post(
                    `${API_URL}/api/profile/outfits`,
                    { outfit_pic_link: encodedImage },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setOutfits([addOutfitResponse.data, ...outfits]);
                setLoading(false);
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        } else {
            console.log("No file selected");
            setLoading(false);
        }
        setLoading(false);
    };

    const handleDelete = async (outfitId: number) => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.delete(
                `${API_URL}/api/profile/outfits`,
                {
                    data: { id: outfitId }, // Include the request body in the `data` property
                    headers: { Authorization: `Bearer ${token}` }, // Include headers as usual
                }
            );
            setOutfits(
                outfits.filter((outfit) => {
                    return outfit.id !== response.data.deletedOutfit.id;
                })
            );
        } catch (error) {
            console.log(error);
        }
    };

    if (!profile) {
        return <div>Loading profile...</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            {loading ? <div className="loading-msg">Uploading...</div> : <></>}
            <form className="content profile" onSubmit={handleSubmit}>
                <div className="profile__header">
                    <div className="profile__user-rating">
                        <h2>Hello {profile.username}</h2>
                        <p>Rating: {profile.rating ? profile.rating : "0"}/5</p>
                    </div>
                    <div className="profile__header--right">
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
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24"
                                    viewBox="0 -960 960 960"
                                    width="24">
                                    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h360v80H200v560h560v-360h80v360q0 33-23.5 56.5T760-120H200Zm480-480v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80ZM240-280h480L570-480 450-320l-90-120-120 160Zm-40-480v560-560Z" />
                                </svg>
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
                                    accept="image/*"
                                />
                            </label>
                        </div>
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
                                    <strong>Shopping For: </strong>
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    className={`${readOnly ? "readonly" : ""}`}
                                    value={formData.gender}
                                    onChange={handleChange}
                                    disabled={readOnly}>
                                    <option
                                        className="gender__option"
                                        value="Male">
                                        Men's Clothes
                                    </option>
                                    <option
                                        className="gender__option"
                                        value="Female">
                                        Women's Clothes
                                    </option>
                                    <option className="gender__option" value="">
                                        All Clothes
                                    </option>
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
                                    <strong>Outfit Budget ($): </strong>
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
                    <div className="profile__detail profile__detail--bio">
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
                    <div className="profile__detail profile__detail--visibility">
                        <label htmlFor="profile_visibility">
                            <strong>Profile Visibility </strong>
                            <input
                                type="checkbox"
                                id="profile_visibility"
                                name="profile_visibility"
                                className={`checkbox ${
                                    readOnly ? "readonly" : ""
                                }`}
                                checked={formData.profile_visibility}
                                onChange={handleChange}
                                disabled={readOnly}
                            />
                        </label>
                        {readOnly ? (
                            <svg
                                className="profile__button profile__button--edit"
                                onClick={editProfile}
                                xmlns="http://www.w3.org/2000/svg"
                                height="26"
                                viewBox="0 -960 960 960"
                                width="26">
                                <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                            </svg>
                        ) : (
                            <div>
                                <button
                                    type="submit"
                                    className="profile__button--save">
                                    <svg
                                        type="submit"
                                        className="profile__button"
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="26"
                                        viewBox="0 -960 960 960"
                                        width="26">
                                        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                                    </svg>
                                </button>
                                <svg
                                    className="profile__button profile__button--cancel"
                                    onClick={editProfile}
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="26"
                                    viewBox="0 -960 960 960"
                                    width="26">
                                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>
                <label className="profile__add-label">
                    Add Outfit
                    <input
                        type="file"
                        className="profile__add-outfit"
                        onChange={(e) => handleAddOutfit(e)}
                        accept="image/*"></input>
                </label>
            </form>

            <Outfits
                outfits={outfits}
                currentUser={true}
                handleDelete={handleDelete}
            />
        </motion.div>
    );
};

export default UserProfilePage;
