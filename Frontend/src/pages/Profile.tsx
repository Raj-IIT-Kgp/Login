import { useLocation } from 'react-router-dom';

const Profile = () => {
    const location = useLocation();
    const { name } = location.state || { name: 'Guest' };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold text-center">Hi {name}</h2>
            </div>
        </div>
    );
};

export default Profile;