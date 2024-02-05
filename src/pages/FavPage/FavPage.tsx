import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "./FavPage.scss";

import axios from "axios";
import Outfits from "../../components/Outfits/Outfits";

const API_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8080";

interface MainPageProps {
    isLoggedIn: boolean;
}

const FavPage: React.FC<MainPageProps> = ({ isLoggedIn }) => {
    const token = localStorage.getItem("token");

    const [favorites, setFavorites] = useState<
        { id: number; outfit_pic_link: string }[]
    >([]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const getFavorites = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}api/profile/favorite`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setFavorites(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        getFavorites();
    }, [token]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            {token ? (
                <section className="content fav">
                    <h1 className="fav__title">Your Favorite Outfits</h1>
                    <Outfits
                        outfits={[]}
                        currentUser={true}
                        favPage={true}
                        favOutfits={favorites}
                    />
                </section>
            ) : (
                <></>
            )}
        </motion.div>
    );
};
export default FavPage;
