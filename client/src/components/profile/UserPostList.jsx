import React, { useEffect, useState } from "react";
import axios from "axios";

const UserPostList = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPostsByUserId = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          process.env.REACT_APP_BASE_URL_CLIENT + "users/posts",

          {
            params: { user_id: userId },
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setPosts(response.data);
      } catch (err) {
        setError("Failed to fetch posts.");
      }
    };

    // if (userId) {
    fetchPostsByUserId();
    // }
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Posts by User ID: {userId}
      </h2>
      {error && <div className="text-red-500">{error}</div>}
      <ul className="space-y-4">
        {posts.map((post) => {
          const imgURL = `http://localhost:7000/uploads/${post.img_path}`;
          console.log("imgURL::", imgURL);

          return (
            <li key={post.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold">{post.post_description}</h3>
              <p className="text-gray-600">
                Uploaded on: {new Date(post.img_upload_time).toLocaleString()}
              </p>
              {post.img_path && (
                <img
                  src={imgURL}
                  alt={post.img_name}
                  className="mt-2 max-w-full rounded"
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UserPostList;
