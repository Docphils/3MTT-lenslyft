import {Link, useNavigate, useLocation} from "react-router-dom";
import {useContext, useState, useEffect, useCallback} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../context/AuthContext";
import SearchContext from "../context/SearchContext";
import axios from "../api/axiosInstance";

const Navbar = () => {
    const {user, logout} = useContext(AuthContext);
    const {setQuery, setResults} = useContext(SearchContext);
    const [tempQuery, setTempQuery] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!tempQuery.trim()) return;

        const {data} = await axios.get(`/movies/search?query=${tempQuery}`);
        setQuery(tempQuery);
        setResults(data);

        if (location.pathname !== "/") {
            navigate("/");
        }
    };

    const handleClear = useCallback(() => {
        setTempQuery("");
        setQuery("");
        setResults([]);
    }, [setQuery, setResults]);

    useEffect(() => {
        if (tempQuery.trim() === "") {
            handleClear();
        }
    }, [tempQuery, handleClear]);

    const NavLink = ({to, children}) => (
        <Link
            to={to}
            className='px-3 py-2 rounded hover:bg-blue-600 transition duration-200'
            onClick={() => setMenuOpen(false)}
        >
            {children}
        </Link>
    );

    return (
        <nav className='bg-blue-700 text-white px-4 py-3 shadow-md relative z-10'>
            {/* Top wrapper with logo, search, menu button */}
            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4'>
                {/* Left: Logo + Hamburger */}
                <div className='flex justify-between items-center'>
                    <Link to='/' className='text-2xl font-bold'>
                        🎬 LensLyft
                    </Link>
                    <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className='md:hidden text-white text-xl'
                        aria-label='Toggle menu'
                    >
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                </div>

                {/* Center: Search */}
                <form
                    onSubmit={handleSearch}
                    className='flex gap-2 flex-grow md:max-w-base md:flex-none'
                >
                    <input
                        value={tempQuery}
                        onChange={(e) => setTempQuery(e.target.value)}
                        placeholder='Search movies...'
                        className='flex-grow p-2 rounded text-black'
                    />
                    {tempQuery && (
                        <button
                            type='button'
                            onClick={handleClear}
                            className='bg-gray-300 text-black px-3 py-1 rounded'
                        >
                            ✕
                        </button>
                    )}
                    <button className='bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 transition'>
                        Search
                    </button>
                </form>


                {/* Right: Menu links */}
                <div
                    className={`md:flex md:items-center lg:gap-4 text-sm ${
                        menuOpen ? "block" : "hidden md:flex"
                    }`}
                >
                    {user ? (
                        <>
                            <NavLink to='/'>Home</NavLink>
                            <NavLink to='/favorites'>Favorites</NavLink>
                            <NavLink to='/social'>Connections</NavLink>
                            <NavLink to='/profile/edit'>Edit profile</NavLink>
                            <button
                                onClick={() => {
                                    logout();
                                    setMenuOpen(false);
                                }}
                                className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition'
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to='/login'>Login</NavLink>
                            <NavLink to='/register'>Register</NavLink>
                        </>
                    )}
                </div>

                <NavLink to="/assistant" className={location.pathname ==='/assistant' ? "text-sm  hover:underline bg-blue-600" : ""} >  🎬 Ask LyftAI </NavLink>
                    {location.pathname !== '/assistant' && (
                        <Link
                            to="/assistant"
                            className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-full shadow-lg z-50 hover:border-4 hover:border-blue-300"
                            title="Talk to Lyft AI"
                        >
                            💬
                        </Link>
                        )}
            </div>
        </nav>
    );
};

export default Navbar;
