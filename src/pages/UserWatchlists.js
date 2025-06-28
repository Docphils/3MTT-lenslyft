import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import MovieCard from '../components/MovieCard';

const UserWatchlists = () => {
  const { userId } = useParams();
  const [watchlists, setWatchlists] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    axios.get(`/users/${userId}`).then(res => {
      setUsername(res.data.username);
      const rawLists = res.data.watchlists || [];

      Promise.all(
        rawLists.map(async (list) => {
          const movies = await Promise.all(
            list.movies.map(id => axios.get(`/movies/${id}`).then(r => r.data).catch(() => null))
          );
          return { ...list, movies: movies.filter(Boolean) };
        })
      ).then(setWatchlists);
    });
  }, [userId]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{username}'s Watchlists</h1>
      {watchlists.map((wl, i) => (
        <div key={i} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{wl.name}</h2>
          <p className="text-sm text-gray-500 mb-4">{wl.description}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {wl.movies.map(movie => (
              <MovieCard key={movie.tmdbId} movie={movie} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserWatchlists;
