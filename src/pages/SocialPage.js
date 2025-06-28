import {useEffect, useState, useContext} from "react";
import axios from "../api/axiosInstance";
import AuthContext from "../context/AuthContext";
import {Link} from "react-router-dom";

const SocialPage = () => {
    const [followedUsers, setFollowedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const {user, authReady} = useContext(AuthContext);

    useEffect(() => {
        let isMounted = true;

        if (!authReady) return;

        const fetchFollowedUsers = async () => {
            try {
                const profile = await axios.get("/users/profile");
                const following = profile.data.following || [];

                const detailed = await Promise.all(
                    following.map(async (u) => {
                        try {
                            const res = await axios.get(`/users/${u._id || u}`);
                            return res.data;
                        } catch (err) {
                            console.warn(
                                `Failed to fetch user ${u._id || u}:`,
                                err.message
                            );
                            return null;
                        }
                    })
                );

                if (isMounted) setFollowedUsers(detailed.filter(Boolean));
            } catch (err) {
                if (isMounted) setFollowedUsers([]);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchFollowedUsers();

        return () => {
            isMounted = false;
        };
    }, [authReady]);

    if (!authReady || loading)
        return <p className='p-4'>Loading followed users...</p>;

    if (followedUsers.length === 0)
        return <p className='p-4'>You're not following anyone yet.</p>;

    return (
        <div className='p-6 max-w-6xl mx-auto'>
            <h1 className='text-3xl font-bold mb-6'>People You Follow</h1>

            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {followedUsers.map((f) => (
                    <div
                        key={f._id}
                        className='bg-white shadow rounded-lg overflow-hidden border'
                    >
                        <div className='flex items-center gap-4 p-4'>
                            <img
                                src={f.profileImage || "/placeholder.jpg"}
                                alt={f.username}
                                className='w-16 h-16 rounded-full object-cover border'
                                onError={(e) =>
                                    (e.currentTarget.src = "/placeholder.jpg")
                                }
                            />

                            <div>
                                <h2 className='text-lg font-bold'>
                                    {f.username}
                                </h2>
                                <p className='text-sm text-gray-500'>{f.bio}</p>
                            </div>
                        </div>

                        <div className='px-4 pb-4 flex flex-col sm:flex-row gap-2 text-sm'>
                            <Link
                                to={`/explore/favorites/${f._id}`}
                                className='text-blue-600 hover:underline'
                            >
                                View Favorites
                            </Link>
                            <Link
                                to={`/explore/watchlists/${f._id}`}
                                className='text-purple-600 hover:underline'
                            >
                                View Watchlists
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SocialPage;
