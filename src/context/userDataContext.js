import {createContext, useEffect, useState} from "react";
import axios from "../api/axiosInstance";

const UserDataContext = createContext();

export const UserDataProvider = ({children}) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const {data} = await axios.get("/users/profile");
                setProfile(data);
            } catch (err) {
                console.warn("Not logged in or token expired");
                setProfile(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const updateWatchlists = async (watchlistData) => {
        try {
            const res = await axios.post("/users/watchlists", watchlistData);
            // Optionally update profile state
            setProfile((prev) => ({...prev, watchlists: res.data}));
        } catch (err) {
            console.error("Failed to update watchlist:", err.message);
        }
    };
    const updateFavorites = async (movieId) => {
        try {
            await axios.post(`/users/favorites/${movieId}`);
            const res = await axios.get("/users/profile");
            setProfile(res.data);
        } catch (err) {
            console.error("Failed to update favorites", err.message);
        }
    };

    const updateProfileInfo = async (updates) => {
        try {
            const {data} = await axios.put("/users/profile", updates);
            setProfile(data);
            return {success: true};
        } catch (err) {
            console.error("Failed to update profile:", err.message);
            return {
                success: false,
                message: err.response?.data?.message || err.message,
            };
        }
    };

    return (
        <UserDataContext.Provider
            value={{
                profile,
                loading,
                updateWatchlists,
                updateFavorites,
                updateProfileInfo,
            }}
        >
            {children}
        </UserDataContext.Provider>
    );
};

export default UserDataContext;
