import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user } = useContext(UserContext);
  const [userInfo, setUserInfo] = useState(null);
  const [ratingHistory, setRatingHistory] = useState([]);
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

        const ratingHistoryResponse = await axios.get(
          `https://codeforces.com/api/user.rating?handle=${user.handle}`
        );
        if (ratingHistoryResponse.data.status !== "OK") {
          throw new Error("Failed to fetch rating history");
        }
        setRatingHistory(ratingHistoryResponse.data.result);
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
      <div className="flex justify-center items-center h-screen bg-zinc-900 text-gray-100">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-zinc-900 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 min-h-screen text-gray-100">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">{userInfo.handle}&apos;s Profile</h1>
        
        <div className="bg-zinc-800 rounded-lg p-6 shadow-md">
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

        <h2 className="text-2xl font-semibold mt-8 mb-4">Rating History</h2>
        {ratingHistory.length === 0 ? (
          <p>No rating history available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700 bg-zinc-800 shadow-md rounded">
              <thead>
                <tr className="bg-zinc-700">
                  <th className="px-4 py-3 text-left text-gray-100 font-medium">
                    Contest
                  </th>
                  <th className="px-4 py-3 text-left text-gray-100 font-medium">
                    Old Rating
                  </th>
                  <th className="px-4 py-3 text-left text-gray-100 font-medium">
                    New Rating
                  </th>
                  <th className="px-4 py-3 text-left text-gray-100 font-medium">
                    Rank
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {ratingHistory.map((change, index) => (
                  <tr key={index} className="hover:bg-gray-700">
                    <td className="px-4 py-3">{change.contestName}</td>
                    <td className="px-4 py-3">{change.oldRating}</td>
                    <td className="px-4 py-3">{change.newRating}</td>
                    <td className="px-4 py-3">{change.rank}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
