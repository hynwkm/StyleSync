import axios from "axios";
import { useEffect, useState } from "react";
import Card from "../../components/Card/Card";
import User from "../../models/users";
import "./LandingPage.scss";

const API_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8080";

export default function LandingPage(props: { isLoggedIn: boolean }) {
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            try {
                if (!props.isLoggedIn) {
                    const users = await axios.get(`${API_URL}/api/user`);
                    setUserList(users.data);
                } else {
                    const token = localStorage.getItem("key");
                    const users = await axios.get(
                        `${API_URL}/api/user/loggedin`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setUserList(users.data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getUsers();
    }, [props.isLoggedIn]);
    if (userList.length === -1) {
        return <></>;
    }

    return (
        <section className="content LandingPage">
            <h1>Browse your top recommendations</h1>
            <ul className="userlist">
                {
                    <>
                        {userList.map((user: User) => {
                            return <Card cardDetails={user} key={user.id} />;
                        })}
                    </>
                }
                <li>{/* cards link to outfit page */}</li>
            </ul>
        </section>
    );
}

// "id",
//     "username",
//     "email",
//     "height",
//     "weight",
//     "rating",
//     "budget",
//     "profile_pic",
//     "dob",
//     "gender",
//     "bio";
