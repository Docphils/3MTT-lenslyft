import { useState } from 'react';
import axios from '../api/axiosInstance';
import MovieCard from '../components/MovieCard';

const MovieSearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const search = async (e) => {
    e.preventDefault();
    const { data } = await axios.get(`/movies/search?q=${query}`);
    setResults(data);
  };

  return (
    <div className="p-4">
      <form onSubmit={search} className="mb-4 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
          className="flex-grow p-2 border"
        />
        <button className="bg-blue-600 text-white px-4 py-2">Search</button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {results.map(movie => <MovieCard key={movie.id} movie={movie} />)}
      </div>
    </div>
  );
};

export default MovieSearchPage;
