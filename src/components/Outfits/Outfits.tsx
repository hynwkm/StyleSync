import axios from "axios";
import { useEffect, useState } from "react";
import capitalizeWords from "../../utils/capitalizeWords";

import Clothing from "../../models/clothing_items";
import Outfit from "../../models/outfits";
import fixUrl from "../../utils/fixUrl";
import "./Outfits.scss";

const API_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8080";

interface OutfitsProps {
    outfits: Outfit[];
    currentUser: boolean;
    handleDelete?: (id: number) => void;
    favPage: boolean;
    favOutfits?: { id: number; outfit_pic_link: string }[];
}

const Outfits: React.FC<OutfitsProps> = ({
    outfits,
    currentUser,
    handleDelete,
    favPage,
    favOutfits,
}) => {
    const [selectedOutfit, setSelectedOutfit] = useState<number | null>();
    const [clothingSet, setClothingSet] = useState<Clothing[]>([]);
    const [favorites, setFavorites] = useState<{ outfit_id: number }[]>([]);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const getClothings = async () => {
            try {
                if (outfits) {
                    const clothingPromises = outfits.map((outfit) =>
                        axios.get<Clothing>(
                            fixUrl(API_URL, `api/clothing/${outfit.id}`)
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
    };

    const handleFav = async (outfitId: number) => {
        console.log("called");
        try {
            if (favorites.some((fav) => fav.outfit_id === outfitId)) {
                const response = await axios.delete(
                    fixUrl(API_URL, `api/profile/favorite/${outfitId}`),
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data) {
                    setFavorites(
                        favorites.filter(
                            (favorite) => favorite.outfit_id !== outfitId
                        )
                    );
                }
            } else {
                console.log("called post req");

                const response = await axios.post(
                    fixUrl(API_URL, `api/profile/favorite/${outfitId}`),
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.data) {
                    setFavorites([...favorites, { outfit_id: outfitId }]);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (!outfits || outfits.length === -1) {
        return <>loading!</>;
    }

    if (currentUser && favPage) {
        return (
            <div className="outfits outfits--favorite">
                {favOutfits ? (
                    favOutfits.length > 0 ? (
                        <div className="outfits__list">
                            {favOutfits.map((outfit, index) => (
                                <div
                                    className="outfits__item"
                                    key={index}
                                    onMouseOver={() =>
                                        handleOutfitShow(outfit.id)
                                    }
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
                                            {currentUser && outfit.id ? (
                                                <svg
                                                    onClick={() => {
                                                        if (handleDelete) {
                                                            handleDelete(
                                                                outfit.id
                                                            );
                                                        }
                                                    }}
                                                    className="outfits__icon"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    height="40"
                                                    viewBox="0 -960 960 960"
                                                    width="40"
                                                    fill="white">
                                                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                                                </svg>
                                            ) : token && outfit.id ? (
                                                <svg
                                                    onClick={() => {
                                                        if (handleFav) {
                                                            handleFav(
                                                                outfit.id
                                                            );
                                                        }
                                                    }}
                                                    className="outfits__icon"
                                                    version="1.1"
                                                    id="Layer_1"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="40"
                                                    height="40"
                                                    viewBox="0 0 64 64">
                                                    <path
                                                        fill={
                                                            favorites.some(
                                                                (fav) =>
                                                                    fav.outfit_id ===
                                                                    outfit.id
                                                            )
                                                                ? "red"
                                                                : "white"
                                                        }
                                                        stroke="#FFF"
                                                        strokeWidth="2"
                                                        strokeMiterlimit="10"
                                                        d="M1,21c0,20,31,38,31,38s31-18,31-38
	c0-8.285-6-16-15-16c-8.285,0-16,5.715-16,14c0-8.285-7.715-14-16-14C7,5,1,12.715,1,21z"
                                                    />
                                                </svg>
                                            ) : (
                                                <></>
                                            )}
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
                                                                {capitalizeWords(
                                                                    `${clothing.color} ${clothing.style} ${clothing.type}`
                                                                )}
                                                            </p>
                                                            <p>
                                                                Rating:{" "}
                                                                {
                                                                    clothing.rating
                                                                }
                                                                /5
                                                            </p>
                                                            <p>
                                                                $
                                                                {clothing.price}
                                                            </p>
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
                                                                    Go to
                                                                    Purchase
                                                                    Link
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
                        <p>No outfits to display. Share or discover styles!</p>
                    )
                ) : (
                    <></>
                )}
            </div>
        );
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
                                    {currentUser && outfit.id ? (
                                        <svg
                                            onClick={() => {
                                                if (handleDelete) {
                                                    handleDelete(outfit.id);
                                                }
                                            }}
                                            className="outfits__icon"
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="40"
                                            viewBox="0 -960 960 960"
                                            width="40"
                                            fill="white">
                                            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                                        </svg>
                                    ) : token && outfit.id ? (
                                        <svg
                                            onClick={() => {
                                                if (handleFav) {
                                                    handleFav(outfit.id);
                                                }
                                            }}
                                            className="outfits__icon"
                                            version="1.1"
                                            id="Layer_1"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="40"
                                            height="40"
                                            viewBox="0 0 64 64">
                                            <path
                                                fill={
                                                    favorites.some(
                                                        (fav) =>
                                                            fav.outfit_id ===
                                                            outfit.id
                                                    )
                                                        ? "red"
                                                        : "white"
                                                }
                                                stroke="#FFF"
                                                strokeWidth="2"
                                                strokeMiterlimit="10"
                                                d="M1,21c0,20,31,38,31,38s31-18,31-38
	c0-8.285-6-16-15-16c-8.285,0-16,5.715-16,14c0-8.285-7.715-14-16-14C7,5,1,12.715,1,21z"
                                            />
                                        </svg>
                                    ) : (
                                        <></>
                                    )}
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
                                                        {capitalizeWords(
                                                            `${clothing.color} ${clothing.style} ${clothing.type}`
                                                        )}
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
                <p>No outfits to display. Share or discover styles!</p>
            )}
        </div>
    );
};

export default Outfits;
