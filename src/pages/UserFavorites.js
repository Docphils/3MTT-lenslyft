import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import MovieCard from '../components/MovieCard'; // your reusable movie component

const UserFavorites = () => {
  const { userId } = useParams();
  const [movies, setMovies] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    axios.get(`/users/${userId}`).then(res => {
      setUsername(res.data.username);
      const ids = res.data.favorites || [];
      Promise.all(ids.map(id => axios.get(`/movies/${id}`)))
        .then(results => setMovies(results.map(r => r.data)))
        .catch(console.error);
    });
  }, [userId]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{username}'s Favorites</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-gray-500">
        {movies.map(movie => (
          <MovieCard key={movie.tmdbId} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default UserFavorites;
