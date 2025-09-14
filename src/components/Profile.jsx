import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useAuth } from "./AuthContext";

const Profile = () => {
  const { user, authLoading } = useAuth(); // ✅ yaha sahi naam se le rahe hain
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user) {
      setUserData(user); // ✅ context se user set
    } else {
      setUserData(null);
    }
  }, [user]);

  if (authLoading) return <Loader />; // ✅ yaha bhi same naam use karna hai

  return (
    <div>
      <div className="p-6 max-w-md mx-auto bg-white shadow rounded-2xl mt-8">
        <h2 className="text-2xl font-bold mb-4 text-center">My Profile</h2>

        {userData ? (
          <div className="space-y-3">
            <p>
              <span className="font-semibold">Name:</span> {userData.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {userData.email}
            </p>
            <p>
              <span className="font-semibold">Role:</span>{" "}
              <span
                className={`px-2 py-1 rounded ${
                  userData.role === "reporter"
                    ? "bg-blue-200 text-blue-800"
                    : "bg-green-200 text-green-800"
                }`}
              >
                {userData.role}
              </span>
            </p>
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No profile data found. Please login.
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
