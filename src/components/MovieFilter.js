import {useContext} from "react";
import FilterContext from "../context/FilterContext";

const MovieFilter = () => {
    const {filters, setFilters, clearFilters} = useContext(FilterContext);

    return (
        <div className='flex flex-wrap gap-4 mb-6 text-black'>
            <select
                value={filters.rating}
                onChange={(e) =>
                    setFilters((f) => ({...f, rating: e.target.value}))
                }
                className='p-2 border rounded'
            >
                <option value=''>Rating</option>
                <option value='7'>7+</option>
                <option value='8'>8+</option>
                <option value='9'>9+</option>
            </select>

            <select
                value={filters.releaseDate}
                onChange={(e) =>
                    setFilters((f) => ({...f, releaseDate: e.target.value}))
                }
                className='p-2 border rounded'
            >
                <option value=''>Release Year</option>
                <option value='2024'>2024</option>
                <option value='2023'>2023</option>
                <option value='2022'>2022</option>
                <option value='2021'>2021</option>
            </select>

            <select
                value={filters.popularity}
                onChange={(e) =>
                    setFilters((f) => ({...f, popularity: e.target.value}))
                }
                className='p-2 border rounded'
            >
                <option value=''>Popularity</option>
                <option value='high'>High → Low</option>
                <option value='low'>Low → High</option>
            </select>

            <button
                onClick={clearFilters}
                className='bg-gray-500 text-white px-3 py-1 rounded'
            >
                Clear Filters
            </button>
        </div>
    );
};

export default MovieFilter;
