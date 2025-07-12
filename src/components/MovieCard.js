import {Link} from "react-router-dom";

const MovieCard = ({movie}) => {
    const tmdbId = movie.tmdbId || movie.id; // Use this consistently
    console.log("MOVIE:", movie);

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
                <h3 className='font-semibold text-base truncate'>
                    {movie.title || movie.name}
                </h3>
                <p className='text-sm text-gray-500'>{movie.release_date}</p>
            </div>
        </Link>
    );
};

export default MovieCard;
