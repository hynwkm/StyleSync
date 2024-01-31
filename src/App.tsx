import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";

import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import LandingPage from "./pages/LandingPage/LandingPage";
import OutfitPage from "./pages/OutfitPage/OutfitPage";
import UserProfilePage from "./pages/UserProfilePage/UserProfilePage";

function App() {
    return (
        <div className="App">
            <Header />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/outfits/:outfitId" element={<OutfitPage />} />
                    {/* <Route path="/login"/ element={}> */}
                    <Route path="/user" element={<UserProfilePage />} />
                </Routes>
            </BrowserRouter>
            <Footer />
        </div>
    );
}

export default App;
