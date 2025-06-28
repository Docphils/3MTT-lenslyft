import {useContext, useState} from "react";
import UserDataContext from "../context/userDataContext";
import {useNavigate} from "react-router-dom";
import axios from "../api/axiosInstance";

const EditProfilePage = () => {
    const {profile, updateProfileInfo} = useContext(UserDataContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: profile?.username || "",
        email: profile?.email || "",
        bio: profile?.bio || "",
        profileImage: profile?.profileImage || "",
        password: "",
    });
    const [message, setMessage] = useState(null);

    const handleChange = (e) =>
        setForm({...form, [e.target.name]: e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await updateProfileInfo(form);
        if (result.success) {
            setMessage("Profile updated successfully!");
            setTimeout(() => navigate("/profile"), 1500);
        } else {
            setMessage(result.message || "Update failed");
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            const {data} = await axios.post("/users/profile/upload", formData, {
                headers: {"Content-Type": "multipart/form-data"},
            });

            setForm((prev) => ({...prev, profileImage: data.profileImage}));
        } catch (err) {
            alert("Upload failed");
        }
    };

    return (
        <div className='max-w-xl mx-auto p-4'>
            <h1 className='text-2xl font-bold mb-4'>Edit Profile</h1>
            {message && <p className='mb-2 text-sm text-blue-600'>{message}</p>}
            <form onSubmit={handleSubmit} className='space-y-4'>
                <input
                    name='username'
                    value={form.username}
                    onChange={handleChange}
                    placeholder='Username'
                    className='p-2 border w-full rounded'
                />
                <input
                    name='email'
                    type='email'
                    value={form.email}
                    onChange={handleChange}
                    placeholder='Email'
                    className='p-2 border w-full rounded'
                />
                <textarea
                    name='bio'
                    value={form.bio}
                    onChange={handleChange}
                    placeholder='Bio'
                    className='p-2 border w-full rounded'
                />
                <label className='block'>
                    Profile Image Upload
                    <input
                        type='file'
                        accept='image/*'
                        onChange={handleImageUpload}
                        className='block mt-1'
                    />
                    
                </label>
                {form.profileImage && (
                        <img
                            src={form.profileImage}
                            alt='Profile'
                            className='w-32 h-32 object-cover rounded-full mb-4'
                        />
                    )}
                <input
                    name='password'
                    type='password'
                    value={form.password}
                    onChange={handleChange}
                    placeholder='New Password (optional)'
                    className='p-2 border w-full rounded'
                />
                <button className='bg-blue-600 text-white px-4 py-2 rounded'>
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditProfilePage;
