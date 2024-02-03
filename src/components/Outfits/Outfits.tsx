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
    const [selectedOutfit, setSelectedOutfit] = useState<number | null>();
    useEffect(() => {
        const fetchOutfits = async () => {
            try {
                if (userId) {
                    const response = await axios.get<Outfit[]>(
                        `${API_URL}/api/user/${userId}/outfits`
                    );
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

    const handleOutfitShow = (outfitId: number) => {
        setSelectedOutfit(outfitId);
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
                            onMouseOver={() => handleOutfitShow(outfit.id)}
                            onMouseLeave={() => {
                                setSelectedOutfit(null);
                            }}>
                            <img
                                src={outfit.outfit_pic_link}
                                alt={`User's outfit`}
                                className="outfits__image"
                            />
                            {selectedOutfit === outfit.id ? (
                                <div className="outfits__details">
                                    <div className="outfits__details-info">
                                        <div className="outfits__card">
                                            <p>Khaki Bomber Jacket</p>
                                            <p>Rating: 4/5</p>
                                            <p>$99</p>
                                            <p>
                                                <a
                                                    href={`https://www.amazon.com/s?k=men+khaki+bomber+jacket`}
                                                    target="_blank"
                                                    rel="noopener noreferrer">
                                                    Go to Purchase Link
                                                </a>
                                            </p>
                                        </div>
                                        <div className="outfits__card">
                                            <p>White Round-neck Shirt</p>
                                            <p>Rating: 4.5/5</p>
                                            <p>$30</p>
                                            <p>
                                                <a
                                                    href={`https://www.amazon.com/s?k=men+white+roundneck+shirt`}
                                                    target="_blank"
                                                    rel="noopener noreferrer">
                                                    Go to Purchase Link
                                                </a>
                                            </p>
                                        </div>
                                        <div className="outfits__card">
                                            <p>Black Denim Jeans</p>
                                            <p>Rating: 4.7/5</p>
                                            <p>$70</p>
                                            <p>
                                                <a
                                                    href={`https://www.amazon.com/s?k=men+black+denim+jean`}
                                                    target="_blank"
                                                    rel="noopener noreferrer">
                                                    Go to Purchase Link
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No outfits found.</p>
            )}
        </div>
    );
};

export default Outfits;
