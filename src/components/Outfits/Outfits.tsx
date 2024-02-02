import axios from "axios";
import { useEffect, useState } from "react";

import Outfit from "../../models/outfits";
import "./Outfits.scss";

const API_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8080";

interface OutfitsProps {
    userId?: string;
}

const Outfits: React.FC<OutfitsProps> = ({ userId }) => {
    const [outfits, setOutfits] = useState<Outfit[]>();
    const [selectedOutfit, setSelectedOutfit] = useState<Outfit>();

    useEffect(() => {
        const fetchOutfits = async () => {
            try {
                if (userId) {
                    const response = await axios.get<Outfit[]>(
                        `${API_URL}/api/user/${userId}/outfits`
                    );
                    console.log(userId);
                    setOutfits(response.data);
                } else {
                    const token = localStorage.getItem("token");
                    const response = await axios.get<Outfit[]>(
                        `${API_URL}/api/profile/outfits`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setOutfits(response.data);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchOutfits();
    }, [userId]);

    const handleOutfitClick = (outfit: Outfit) => {
        setSelectedOutfit(outfit);
    };

    if (!outfits || outfits.length === -1) {
        return <>loading!</>;
    }

    return (
        <div className="outfits">
            {outfits.length > 0 ? (
                <div className="outfits__list">
                    {outfits.map((outfit, index) => (
                        <div
                            className="outfits__item"
                            key={index}
                            onClick={() => handleOutfitClick(outfit)}>
                            <img
                                src={outfit.outfit_pic_link}
                                alt={`User's outfit`}
                                className="outfits__image"
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <p>No outfits found.</p>
            )}
            {selectedOutfit && (
                <div className="outfits__details">
                    <img
                        src={selectedOutfit.outfit_pic_link}
                        alt="Selected outfit"
                        className="outfits__details-image"
                    />
                    <div className="outfits__details-info">
                        <p>Color: Red</p> {/* Hardcoded info */}
                        <p>Type: Dress</p> {/* Hardcoded info */}
                        <p>Rating: 4/5</p> {/* Hardcoded info */}
                        <p>Price: $99</p> {/* Hardcoded info */}
                        <p>
                            Purchase Link:{" "}
                            <a href="http://example.com">Buy Here</a>
                        </p>{" "}
                        {/* Hardcoded info */}
                        <p>Color: Red</p> {/* Hardcoded info */}
                        <p>Type: Dress</p> {/* Hardcoded info */}
                        <p>Rating: 4/5</p> {/* Hardcoded info */}
                        <p>Price: $99</p> {/* Hardcoded info */}
                        <p>
                            Purchase Link:{" "}
                            <a href="http://example.com">Buy Here</a>
                        </p>{" "}
                        {/* Hardcoded info */}
                        <p>Color: Red</p> {/* Hardcoded info */}
                        <p>Type: Dress</p> {/* Hardcoded info */}
                        <p>Rating: 4/5</p> {/* Hardcoded info */}
                        <p>Price: $99</p> {/* Hardcoded info */}
                        <p>
                            Purchase Link:{" "}
                            <a href="http://example.com">Buy Here</a>
                        </p>{" "}
                        {/* Hardcoded info */}
                        <p>Color: Red</p> {/* Hardcoded info */}
                        <p>Type: Dress</p> {/* Hardcoded info */}
                        <p>Rating: 4/5</p> {/* Hardcoded info */}
                        <p>Price: $99</p> {/* Hardcoded info */}
                        <p>
                            Purchase Link:{" "}
                            <a href="http://example.com">Buy Here</a>
                        </p>{" "}
                        {/* Hardcoded info */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Outfits;
