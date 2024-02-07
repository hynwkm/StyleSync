import axios from "axios";
import { motion } from "framer-motion";
import { useEffect } from "react";
import Card from "../../components/Card/Card";
import User from "../../models/users";
import fixUrl from "../../utils/fixUrl";
import "./MainPage.scss";

const API_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8080";

interface MainPageProps {
    isLoggedIn: boolean;
    userList: User[];
    setUserList: (users: User[]) => void;
}

const MainPage: React.FC<MainPageProps> = ({
    isLoggedIn,
    userList,
    setUserList,
}) => {
    const token = localStorage.getItem("token");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    useEffect(() => {
        const getUsers = async () => {
            try {
                if (!isLoggedIn) {
                    const users = await axios.get(fixUrl(API_URL, `api/user`));
                    setUserList(users.data);
                } else {
                    const token = localStorage.getItem("token");
                    const users = await axios.get(
                        fixUrl(API_URL, `api/user/loggedin`),
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

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <section className="content main">
                <h1 className="main__title">
                    {token ? "Handpicked for you" : "Featured"}
                </h1>
                <div className="main__list-wrapper">
                    <div className="main__list">
                        {
                            <>
                                {userList.map((user: User) => {
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
                </div>
            </section>
        </motion.div>
    );
};
export default MainPage;
