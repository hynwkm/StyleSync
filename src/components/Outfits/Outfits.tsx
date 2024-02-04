import axios from "axios";
import { useEffect, useState } from "react";

import Clothing from "../../models/clothing_items";
import Outfit from "../../models/outfits";
import "./Outfits.scss";

const API_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8080";

interface OutfitsProps {
    outfits: Outfit[];
}

const Outfits: React.FC<OutfitsProps> = ({ outfits }) => {
    const [selectedOutfit, setSelectedOutfit] = useState<number | null>();
    const [clothingSet, setClothingSet] = useState<Clothing[]>([]);

    useEffect(() => {
        const getClothings = async () => {
            try {
                if (outfits) {
                    const clothingPromises = outfits.map((outfit) =>
                        axios.get<Clothing>(
                            `${API_URL}/api/clothing/${outfit.id}`
                        )
                    );
                    const clothingResponses = await Promise.all(
                        clothingPromises
                    );

                    const allClothings = clothingResponses.map(
                        (response) => response.data
                    );
                    setClothingSet(allClothings);
                } else {
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        };
        getClothings();
    }, [outfits]);

    const handleOutfitShow = (outfitId: number) => {
        setSelectedOutfit(outfitId);
        console.log(outfitId);
    };
    console.log(clothingSet);
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
                                        {clothingSet
                                            .flat()
                                            .filter(
                                                (clothing) =>
                                                    clothing.outfit_id ===
                                                    outfit.id
                                            )
                                            .map((clothing, index) => (
                                                <div
                                                    key={index}
                                                    className="outfits__card">
                                                    <p>
                                                        {clothing.color}{" "}
                                                        {clothing.style}{" "}
                                                        {clothing.type}
                                                    </p>
                                                    <p>
                                                        Rating:{" "}
                                                        {clothing.rating}/5
                                                    </p>
                                                    <p>${clothing.price}</p>
                                                    <p>
                                                        <a
                                                            className="outfits__purchase-link"
                                                            href={`https://www.amazon.com/s?k=${encodeURIComponent(
                                                                clothing.color
                                                            )}+${encodeURIComponent(
                                                                clothing.style
                                                            )}+${encodeURIComponent(
                                                                clothing.type
                                                            )}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer">
                                                            Go to Purchase Link
                                                        </a>
                                                    </p>
                                                </div>
                                            ))}
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
