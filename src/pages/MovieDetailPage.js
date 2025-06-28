import {useParams} from "react-router-dom";
import {useEffect, useState, useContext} from "react";
import axios from "../api/axiosInstance";
import AuthContext from "../context/AuthContext";
import UserDataContext from "../context/userDataContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const MovieDetailPage = () => {
    const {id} = useParams();
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [followedUsers, setFollowedUsers] = useState([]);
    const {user} = useContext(AuthContext);
    const {updateFavorites, profile} = useContext(UserDataContext);
    const [selectedList, setSelectedList] = useState("");
    const [isFavorite, setIsFavorite] = useState(false);
    const [hoveredStar, setHoveredStar] = useState(0);

    const tmdbId = movie?.tmdbId || movie?.id;

    useEffect(() => {
        axios.get(`/movies/${id}`).then((res) => setMovie(res.data));
        axios.get(`/reviews/${id}`).then((res) => setReviews(res.data));

        if (user) {
            axios.get("/users/profile").then((res) => {
                const data = res.data;
                setFollowedUsers(data.following.map((u) => u._id || u));
                setIsFavorite(data.favorites.includes(id));
            });
        }
    }, [id, user]);

    const handleReview = async () => {
  if (rating < 1 || !reviewText.trim()) {
    return alert("Please select a star rating and enter a comment.");
  }

  const existingReview = reviews.find(
    (r) => r.user._id === (user._id || user.id)
  );

  const payload = {
    movieId: tmdbId,
    rating,
    reviewText,
  };

  try {
    if (existingReview) {
      // User already reviewed this movie → update
      await axios.put(`/reviews/${existingReview._id}`, payload);
    } else {
      // New review
      await axios.post("/reviews", payload);
    }

    const res = await axios.get(`/reviews/${id}`);
    setReviews(res.data);
    setRating(0);
    setReviewText("");
  } catch (error) {
    console.error("Review submission failed:", error.response?.data || error);
    alert("Failed to submit review. Please try again.");
  }
};



    const toggleFollow = async (targetId) => {
        if (!user || targetId === user?._id) return;
        await axios.post(`/social/${targetId}`);
        setFollowedUsers((prev) =>
            prev.includes(targetId)
                ? prev.filter((id) => id !== targetId)
                : [...prev, targetId]
        );
    };

    const handleToggleFavorite = async () => {
        await updateFavorites(tmdbId);
        setIsFavorite((prev) => !prev);
    };

    const renderStars = (num) => {
        return [...Array(5)].map((_, i) => (
            <FontAwesomeIcon
                key={i}
                icon='star'
                className={`text-yellow-500 mr-1 ${
                    i < num ? "" : "opacity-30"
                }`}
            />
        ));
    };

    if (!movie) return <p className='p-6 text-center'>Loading movie...</p>;

    const handleStarClick = (index) => {
        setRating(index);
    };

    const handleStarHover = (index) => {
        setHoveredStar(index);
    };

    const handleStarLeave = () => {
        setHoveredStar(0);
    };

    return (
        <div className='max-w-6xl mx-auto px-4 py-6 space-y-8'>
            {/* Movie Banner */}
            <div className='flex flex-col md:flex-row gap-6'>
                <img
                    src={`https://image.tmdb.org/t/p/w500${
                        movie.poster || movie.poster_path
                    }`}
                    alt={movie.title}
                    className='w-full md:w-60 rounded-lg shadow-md'
                />
                <div className='flex-1 space-y-3'>
                    <h1 className='text-3xl font-bold'>{movie.title}</h1>
                    <p className='text-sm text-gray-600'>{movie.releaseDate}</p>
                    <p className='text-gray-800'>{movie.overview}</p>

                    {movie.trailerUrl && (
                        <div className='mt-4'>
                            <iframe
                                className='w-full h-64 rounded shadow'
                                src={movie.trailerUrl.replace(
                                    "watch?v=",
                                    "embed/"
                                )}
                                title='Trailer'
                                frameBorder='0'
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}

                    {user && (
                        <button
                            onClick={handleToggleFavorite}
                            className='bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded transition'
                        >
                            {isFavorite
                                ? "★ Remove from Favorites"
                                : "☆ Add to Favorites"}
                        </button>
                    )}
                </div>
            </div>

            {/* Watchlist */}
            {user && profile?.watchlists.length > 0 && (
                <div className='bg-gray-100 rounded-lg p-4 shadow-md max-w-md mx-auto'>
                    <label className='block mb-2 font-semibold'>
                        Add to Watchlist
                    </label>
                    <div className='flex gap-2'>
                        <select
                            className='flex-1 p-2 border rounded'
                            value={selectedList}
                            onChange={(e) => setSelectedList(e.target.value)}
                        >
                            <option value=''>Select a list</option>
                            {profile.watchlists.map((wl) => (
                                <option key={wl.name} value={wl.name}>
                                    {wl.name}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={async () => {
                                if (!selectedList)
                                    return alert("Select a list.");
                                await axios.post(
                                    `/users/watchlists/add/${tmdbId}`,
                                    {
                                        listName: selectedList,
                                    }
                                );
                                alert("Added to watchlist!");
                            }}
                            className='bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded'
                        >
                            Add
                        </button>
                    </div>
                </div>
            )}

            {/* Review Form */}
            {user && (
                <div className='bg-white p-6 rounded shadow-md max-w-xl mx-auto'>
                    <h2 className='text-xl font-semibold mb-4'>
                        Leave a Review
                    </h2>
                    <div className='space-y-3'>
                        <div className='flex space-x-2'>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FontAwesomeIcon
                                    key={star}
                                    icon='star'
                                    onClick={() => handleStarClick(star)}
                                    onMouseEnter={() => handleStarHover(star)}
                                    onMouseLeave={handleStarLeave}
                                    className={`cursor-pointer text-2xl transition ${
                                        (hoveredStar || rating) >= star
                                            ? "text-yellow-500"
                                            : "text-gray-300"
                                    }`}
                                />
                            ))}
                        </div>

                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder='Write your thoughts...'
                            className='w-full p-3 border rounded resize-none h-28'
                        />
                        <button
                            onClick={handleReview}
                            className='bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded'
                        >
                            Submit Review
                        </button>
                    </div>
                </div>
            )}

            {/* Reviews */}
            <div>
                <h3 className='text-2xl font-bold mb-4'>User Reviews</h3>
                <div className='space-y-5'>
                    {reviews.map((r, i) => (
                        <div
                            key={i}
                            className='bg-gray-50 border rounded p-4 flex justify-between items-start gap-4'
                        >
                            <div className='flex-1'>
                                <p className='font-semibold text-gray-800'>
                                    {user &&
                                    r.user._id === (user._id || user.id)
                                        ? "You"
                                        : r.user.username}
                                </p>
                                <div className='mb-1'>
                                    {renderStars(r.rating)}
                                </div>
                                <p className='text-gray-700'>{r.reviewText}</p>
                            </div>

                            {user && r.user._id !== (user._id || user.id) && (
                                <button
                                    onClick={() => toggleFollow(r.user._id)}
                                    className={`px-4 py-2 rounded text-sm font-medium transition ${
                                        followedUsers.includes(r.user._id)
                                            ? "bg-gray-400 text-white hover:bg-gray-500"
                                            : "bg-blue-500 text-white hover:bg-blue-600"
                                    }`}
                                >
                                    {followedUsers.includes(r.user._id)
                                        ? "Unfollow"
                                        : "Follow"}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MovieDetailPage;
