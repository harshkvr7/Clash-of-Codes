import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user } = useContext(UserContext);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const userInfoResponse = await axios.get(
          `https://codeforces.com/api/user.info?handles=${user.handle}`
        );
        if (userInfoResponse.data.status !== "OK") {
          throw new Error("Failed to fetch user info");
        }
        setUserInfo(userInfoResponse.data.result[0]);
      } catch (err) {
        console.error(err);
        setError("Failed to load user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-gray-100">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-gray-100">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">{userInfo.handle}&apos;s Profile</h1>
        
        <div className="bg-zinc-900 rounded-lg p-6 shadow-md border border-zinc-700 ">
          <p className="mb-2">
            <strong className="text-gray-100">Name:</strong>{" "}
            {userInfo.firstName || "N/A"} {userInfo.lastName || ""}
          </p>
          <p className="mb-2">
            <strong className="text-gray-100">Country:</strong>{" "}
            {userInfo.country || "N/A"}
          </p>
          <p className="mb-2">
            <strong className="text-gray-100">City:</strong>{" "}
            {userInfo.city || "N/A"}
          </p>
          <p className="mb-2">
            <strong className="text-gray-100">Rating:</strong>{" "}
            {userInfo.rating || "N/A"}
          </p>
          <p>
            <strong className="text-gray-100">Rank:</strong>{" "}
            {userInfo.rank || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
