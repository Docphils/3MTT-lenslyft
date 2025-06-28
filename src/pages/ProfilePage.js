import {useContext, useEffect, useState} from "react";
import MovieCard from "../components/MovieCard";
import UserDataContext from "../context/userDataContext";
import axios from "../api/axiosInstance";
import WatchlistPage from "./WatchlistPage";

const ProfilePage = () => {
    const {profile, loading} = useContext(UserDataContext);
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(true);
    const [watchlistDetails, setWatchlistDetails] = useState({});
    const [activeWatchlist, setActiveWatchlist] = useState(null);
    const [watchlistMovies, setWatchlistMovies] = useState([]);
    const [loadingWatchlist, setLoadingWatchlist] = useState(false);
    const [createWatchlist, setCreateWatchlist] = useState(false);

    useEffect(() => {
        if (!profile) return;
        const fetchFavorites = async () => {
            if (!profile?.favorites || profile.favorites.length === 0) {
                setFavoriteMovies([]);
                setLoadingFavorites(false);
                return;
            }

            try {
                const results = await Promise.all(
                    profile.favorites
                        .filter(
                            (id) => typeof id === "string" && id.trim() !== ""
                        )
                        .map(async (id) => {
                            try {
                                const res = await axios.get(`/movies/${id}`);
                                return res.data;
                            } catch (err) {
                                console.warn(
                                    `Failed to load movie: ${id}`,
                                    err.response?.data?.message || err.message
                                );
                                return null; // ignore bad ones
                            }
                        })
                );

                setFavoriteMovies(results.filter(Boolean)); // remove nulls
            } catch (err) {
                console.error("Error fetching favorites:", err);
                setFavoriteMovies([]);
            } finally {
                setLoadingFavorites(false);
            }
        };

        const fetchWatchlistDetails = async () => {
            const all = {};

            await Promise.all(
                profile.watchlists.map(async (list) => {
                    const lastMovieId = [...list.movies]
                        .reverse()
                        .find(Boolean);
                    if (!lastMovieId) return;

                    try {
                        const res = await axios.get(`/movies/${lastMovieId}`);
                        all[list.name] = {
                            poster: res.data.poster_path || res.data.poster,
                            movies: list.movies,
                        };
                    } catch (err) {
                        console.warn(
                            `Could not fetch movie ${lastMovieId}`,
                            err.message
                        );
                    }
                })
            );

            setWatchlistDetails(all);
        };
        fetchFavorites();
        fetchWatchlistDetails();
    }, [profile]);

    const openWatchlist = async (listName, movieIds) => {
        setActiveWatchlist(listName);
        setLoadingWatchlist(true);
        try {
            const movies = await Promise.all(
                movieIds.map(async (id) => {
                    const res = await axios.get(`/movies/${id}`);
                    return res.data;
                })
            );
            setWatchlistMovies(movies);
        } catch (err) {
            console.error("Failed to load watchlist:", err.message);
            setWatchlistMovies([]);
        } finally {
            setLoadingWatchlist(false);
        }
    };
    const handleCreate = () => {
        if (createWatchlist === true) {
            setCreateWatchlist(false);
        } else {
            setCreateWatchlist(true);
        }
    };

    const closeWatchlist = () => {
        setActiveWatchlist(null);
        setWatchlistMovies([]);
    };

    if (loading) return <p className='p-4'>Loading profile...</p>;
    if (!profile) return <p className='p-4'>Not logged in</p>;

    return (
        <>
            {activeWatchlist && (
                <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-20'>
                    <div className='bg-white w-full max-w-4xl rounded-lg p-4 relative max-h-[80vh] overflow-y-auto'>
                        <button
                            onClick={closeWatchlist}
                            className='absolute top-2 right-2 text-red-500 font-bold text-xl'
                        >
                            &times;
                        </button>
                        <h2 className='text-2xl font-bold mb-4'>
                            {activeWatchlist}
                        </h2>
                        {loadingWatchlist ? (
                            <p>Loading movies...</p>
                        ) : (
                            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                                {watchlistMovies.map((movie) => (
                                    <MovieCard
                                        key={movie.id || movie.tmdbId}
                                        movie={movie}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className='p-4'>
                {profile && (
                    <>
                        <div className='flex w-full items-start justify-between'>
                            <div>
                                <h1 className='text-3xl font-bold mb-4 text-blue-600'>
                                    {profile.username}
                                </h1>
                                <p className='text-gray-600 mb-4'>
                                    {profile.bio}
                                </p>
                            </div>
                            <button
                                onClick={handleCreate}
                                className=' rounded text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 '
                            >
                                {createWatchlist
                                    ? "Close Form"
                                    : "Create Watchlist"}
                            </button>
                        </div>
                        {createWatchlist && <WatchlistPage />}
                    </>
                )}

                <h2 className='text-2xl font-semibold mb-2'>Favorite Movies</h2>
                {loadingFavorites ? (
                    <p className='text-gray-500'>Loading favorites...</p>
                ) : (
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        {favoriteMovies.map((movie) => (
                            <MovieCard
                                key={movie.tmdbId || movie.id}
                                movie={movie}
                            />
                        ))}
                    </div>
                )}

                <h2 className='text-2xl font-semibold mt-6 mb-2'>Watchlists</h2>

                <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                    {Array.isArray(profile.watchlists) &&
                        profile.watchlists.length > 0 &&
                        profile.watchlists.map((list) => {
                            const detail = watchlistDetails[list.name];
                            return (
                                <div
                                    key={list.name}
                                    className='cursor-pointer border rounded overflow-hidden shadow'
                                    onClick={() =>
                                        openWatchlist(list.name, list.movies)
                                    }
                                >
                                    {detail?.poster ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w500${detail.poster}`}
                                            alt={list.name}
                                            className='w-full h-56 object-cover'
                                        />
                                    ) : (
                                        <div className='w-full h-56 bg-gray-300 flex items-center justify-center'>
                                            <span>No Poster</span>
                                        </div>
                                    )}
                                    <div className='p-2'>
                                        <h3 className='font-semibold text-lg'>
                                            {list.name}
                                        </h3>
                                        <p className='text-sm text-gray-500'>
                                            {list.movies.length} movies
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
