import axios from "axios";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card/Card";
import bannerImage from "../../data/banner.jpg";
import User from "../../models/users";
import "./LandingPage.scss";

const API_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8080";

interface LandingPageProps {
    isLoggedIn: boolean;
    userList: User[];
    setUserList: (users: User[]) => void;
}

export default function LandingPage({
    isLoggedIn,
    userList,
    setUserList,
}: LandingPageProps) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    useEffect(() => {
        const getUsers = async () => {
            try {
                if (!isLoggedIn) {
                    const users = await axios.get(`${API_URL}/api/user`);
                    setUserList(users.data);
                } else {
                    const token = localStorage.getItem("token");
                    const users = await axios.get(
                        `${API_URL}/api/user/loggedin`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    const userData = users.data.map((item: any[]) => item[0]);
                    setUserList(userData);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getUsers();
    }, [isLoggedIn, setUserList]);

    const navigate = useNavigate();
    function toMain() {
        navigate("/discover");
    }

    if (userList.length === -1) {
        return <></>;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <div className="banner">
                <h1 className="banner__title">FIND YOUR BEST FIT</h1>
                <img
                    className="banner__image"
                    src={bannerImage}
                    alt="banner img"
                />
            </div>
            <div className="subbanner">
                <h2>Elevate your style with Style Fit.</h2>
                <div className="subbanner__description">
                    Our cutting-edge platform crafts a customized collection of
                    outfit suggestions just for you, taking into account your
                    physique and budget. Share your unique look to inspire
                    others or refresh your wardrobe with trendsetting ideas. Bid
                    farewell to fashion dilemmas and embrace a wardrobe that
                    perfectly suits you. Dive into a seamless style
                    experience—try it now!
                </div>
            </div>
            <section className="content landing">
                <h1 className="landing__title">
                    Get Inspired by People Like You
                </h1>
                <div className="userlist">
                    {
                        <>
                            {userList.slice(0, 4).map((user: User) => {
                                return (
                                    <Card
                                        cardDetails={user}
                                        key={user.id}
                                        userId={user.id}
                                    />
                                );
                            })}
                        </>
                    }
                </div>
                <div className="landing__start" onClick={toMain}>
                    GET STARTED
                </div>
            </section>
        </motion.div>
    );
}
