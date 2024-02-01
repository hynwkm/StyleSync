import axios from "axios";
import { useEffect } from "react";
import Card from "../../components/Card/Card";
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
    // const userList = props.userList;
    // const isLoggedIn = props.isLoggedIn;
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
    if (userList.length === -1) {
        return <></>;
    }

    return (
        <section className="content LandingPage">
            <h1>Browse your top recommendations</h1>
            <div className="userlist">
                {
                    <>
                        {userList.map((user: User) => {
                            return <Card cardDetails={user} key={user.id} />;
                        })}
                    </>
                }
            </div>
        </section>
    );
}
