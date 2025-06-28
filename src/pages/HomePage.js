import {useEffect, useState, useContext} from "react";
import axios from "../api/axiosInstance";
import MovieCard from "../components/MovieCard";
import AuthContext from "../context/AuthContext";
import SearchContext from "../context/SearchContext";
import MovieFilter from "../components/MovieFilter";
import FilterContext from "../context/FilterContext";

const HomePage = () => {
    const {user} = useContext(AuthContext);
    const {query, results} = useContext(SearchContext);
    const [trending, setTrending] = useState([]);
    const [recommended, setRecommended] = useState([]);
    const {filters} = useContext(FilterContext);

    const applyFilters = (movies) => {
        let filtered = [...movies];

        if (filters.rating) {
            filtered = filtered.filter(
                (m) => m.vote_average >= parseFloat(filters.rating)
            );
        }

        if (filters.releaseDate) {
            filtered = filtered.filter((m) =>
                m.release_date?.startsWith(filters.releaseDate)
            );
        }

        if (filters.popularity) {
            filtered.sort((a, b) =>
                filters.popularity === "high"
                    ? b.popularity - a.popularity
                    : a.popularity - b.popularity
            );
        }

        return filtered;
    };

    useEffect(() => {
        const fetchMovies = async () => {
            const apiKey = process.env.REACT_APP_TMDB_KEY;

            try {
                const res = await fetch(
                    `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`
                );
                const data = await res.json();
                setTrending(data.results || []);
            } catch (err) {
                console.error("TMDb fetch error:", err.message);
            }

            if (user) {
                try {
                    const {data: recData} = await axios.get(
                        "/users/recommendations"
                    );
                    setRecommended(recData);
                } catch (err) {
                    console.error("Recommendation fetch error:", err.message);
                }
            }
        };

        fetchMovies();
    }, [user]);

    return (
        <div className='p-4 max-w-7xl mx-auto'>
            <MovieFilter />
            {query ? (
                <>
                    <h1 className='text-3xl font-bold mb-4'>
                        Search Results for “{query}”
                    </h1>
                    {results.length === 0 ? (
                        <p>No movies found.</p>
                    ) : (
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                            {results &&
                                applyFilters(results).map((movie) => (
                                    <MovieCard key={movie.id} movie={movie} />
                                ))}
                        </div>
                    )}
                </>
            ) : (
                <>
                    <h1 className='text-3xl font-bold mb-4'>Trending Movies</h1>
                    {trending && (
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                            {applyFilters(trending).map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </div>
                    )}
                    {!trending && (
                        <div className='text-lg text-center m-auto p-10 text-black font-semibold'>
                            Could not load trending movies
                        </div>
                    )}
                    {user && recommended.length > 0 && (
                        <>
                            <h2 className='text-2xl font-semibold mt-10 mb-4'>
                                Recommended For You
                            </h2>
                            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                                {applyFilters(recommended).map((movie) => (
                                    <MovieCard key={movie.id} movie={movie} />
                                ))}
                            </div>
                        </>
                    )}

                    {!user && (
                        <div className='text-center mt-10 text-gray-700'>
                            <p className='text-lg mb-2'>
                                Want personalized movie recommendations?
                            </p>
                            <p>
                                <a
                                    href='/register'
                                    className='text-blue-600 underline font-semibold'
                                >
                                    Create an account
                                </a>{" "}
                                or{" "}
                                <a
                                    href='/login'
                                    className='text-blue-600 underline font-semibold'
                                >
                                    log in
                                </a>{" "}
                                to get started!
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default HomePage;
