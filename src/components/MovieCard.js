import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";

const MovieCard = ({movie}) => {
    const tmdbId = movie.tmdbId || movie.id; // Use this consistently
    const rating =
    typeof movie.vote_average === "number" && movie.vote_average > 0
      ? (movie.vote_average / 2).toFixed(1)
      : typeof movie.averageRating === "number"
      ? (movie.averageRating / 2).toFixed(1)
      : "N/A";


    return (
        <Link
            to={`/movie/${tmdbId}`} // ✅ Correctly use tmdbId
            className='bg-white shadow hover:shadow-lg rounded overflow-hidden transition'
        >
            <img
                src={`https://image.tmdb.org/t/p/w500${
                    movie.poster_path || movie.poster
                }`}
                alt={movie.title}
                className='w-full h-72 object-cover'
            />
            <div className='p-2'>
                <h3 className='font-semibold text-base truncate text-gray-900'>
                    {movie.title || movie.name}
                </h3>
                <div className="flex justify-between text-sm items-center">
                    <p className='text-gray-500'>{movie.release_date || movie.releaseDate}</p>
                    <p className="flex text-yellow-500 items-center">
                        <FontAwesomeIcon icon="fa-solid fa-star" />
                        <span className="text-gray-700">{rating}</span>
                  
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;
