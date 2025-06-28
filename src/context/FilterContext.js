import { createContext, useState } from "react";

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    rating: "",
    releaseDate: "",
    popularity: "",
  });

  const clearFilters = () => {
    setFilters({ rating: "", releaseDate: "", popularity: "" });
  };

  return (
    <FilterContext.Provider value={{ filters, setFilters, clearFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export default FilterContext;
