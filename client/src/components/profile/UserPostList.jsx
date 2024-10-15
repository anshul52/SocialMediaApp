import React, { useEffect, useState } from "react";
import axios from "axios";
import { BsThreeDotsVertical } from "react-icons/bs";

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
    <div className="max-w-4xl overflow-y-scroll max-h-screen dark-scrollbar mx-auto p-6 text-white">
      <h2 className="text-2xl font-semibold mb-4">
        {/* Posts by User ID: {userId} */}
        Your all post
      </h2>
      {error && <div className="text-red-500">{error}</div>}
      <ul className="space-y-4">
        {posts?.reverse()?.map((post) => {
          const imgURL = `http://localhost:7000/uploads/${post?.img_path}`;
          console?.log("imgURL::", imgURL);

          return (
            <li
              key={post?.id}
              className="bg-[#050708]/30 p-4 rounded-lg shadow"
            >
              <div className="flex items-center gap-3 w-full   justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-[40px] w-[40px] bg-red-400 rounded-full"></div>
                  <div>
                    <h2>Amarshan Gupta</h2>
                    <h3 className="text-[12px] opacity-50">
                      {new Date(post?.img_upload_time)?.toLocaleString()}
                    </h3>
                  </div>
                </div>
                <div>
                  <BsThreeDotsVertical />
                </div>
              </div>

              <h3 className="font-bold text-white">{post?.post_description}</h3>

              {post?.img_path && (
                <img
                  src={imgURL}
                  alt={post?.img_name}
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
