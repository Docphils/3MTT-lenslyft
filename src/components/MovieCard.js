import {Link} from "react-router-dom";

const MovieCard = ({movie}) => {
    const tmdbId = movie.tmdbId || movie.id; // Use this consistently


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
                <div className="flex justify-between text-sm ">
                    <p className='text-gray-500'>{movie.release_date}</p>
                    <i className="fa-solid fa-star text-yellow-500 mr-1">
                        <span className="text-gray-700">{(movie.vote_average / 2).toFixed(1)}</span>
                    </i>
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;
