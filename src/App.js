import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import ProfilePage from "./pages/ProfilePage";
import MovieSearchPage from "./pages/MovieSearchPage";
import SocialPage from "./pages/SocialPage";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/NavBar";
import UserFavorites from "./pages/UserFavorites";
import UserWatchlists from "./pages/UserWatchlists";
import EditProfilePage from './pages/EditProfilePage';


function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/register' element={<RegisterPage />} />
                <Route path='/movie/:id' element={<MovieDetailPage />} />
                <Route
                    path='/favorites'
                    element={
                        <PrivateRoute>
                            <ProfilePage />
                        </PrivateRoute>
                    }
                />
                <Route path='/search' element={<MovieSearchPage />} />
                
                <Route
                    path='/social'
                    element={
                        <PrivateRoute>
                            <SocialPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path='/explore/favorites/:userId'
                    element={
                        <PrivateRoute>
                            <UserFavorites />
                        </PrivateRoute>
                    }
                />
                <Route
                    path='/explore/watchlists/:userId'
                    element={
                        <PrivateRoute>
                            <UserWatchlists />
                        </PrivateRoute>
                    }
                />
                <Route path="/profile/edit" element={<PrivateRoute><EditProfilePage /></PrivateRoute>} />
            </Routes>
        </Router>
    );
}

export default App;
