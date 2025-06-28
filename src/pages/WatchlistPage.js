import {useEffect, useState, useContext} from "react";
import axios from "../api/axiosInstance";
import UserDataContext from "../context/userDataContext";

const WatchlistPage = () => {
    const [watchlists, setWatchlists] = useState([]);
    const [form, setForm] = useState({name: "", description: "", movies: []});
    const {updateWatchlists} = useContext(UserDataContext);
    const fetchWatchlists = async () => {
        try {
            const res = await axios.get("/users/profile");
            setWatchlists(res.data.watchlists);
        } catch (error) {
            console.error("Failed to fetch watchlists:", error);
            setWatchlists([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateWatchlists(form);
        fetchWatchlists(); // Call fetchWatchlists to refresh the list displayed on this page
        setForm({name: "", description: "", movies: []});
    };

    useEffect(() => {
        fetchWatchlists();
    }, []);

    return (
        <div className='p-4 max-w-4xl mx-auto flex gap-4'>
            <div className="rounded shadow w-full hover:shadow-lg p-4">
                <h1 className='text-2xl font-bold mb-4 text-blue-600'>
                    Create Watchlists
                </h1>
                <form onSubmit={handleSubmit} className='space-y-4 mb-8 '>
                    <input
                        placeholder='List Name'
                        value={form.name}
                        onChange={(e) =>
                            setForm({...form, name: e.target.value})
                        }
                        className='w-full p-2 border'
                    />
                    <textarea
                        placeholder='Description'
                        value={form.description}
                        onChange={(e) =>
                            setForm({...form, description: e.target.value})
                        }
                        className='w-full p-2 border'
                    />
                    <button
                        type='submit'
                        className='bg-blue-500 text-white px-4 py-2'
                    >
                        Save Watchlist
                    </button>
                </form>
            </div>
            <ul className='rounded shadow w-full hover:shadow-lg p-4'>
                <h1 className='text-2xl font-bold mb-4 text-blue-600'>
                    My Watchlists
                </h1>
                {watchlists.map((wl, i) => (
                    <li key={i} className='mb-2 border-b hover:bg-gray-50'>
                        <strong>{wl.name}</strong> — {wl.movies.length} movies
                        <p className='text-sm text-gray-500'>
                            {wl.description}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WatchlistPage;
