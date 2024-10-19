import { FaRegComment } from "react-icons/fa";
import { BiLike } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiSolidLike } from "react-icons/bi";
import { PiShareFatBold } from "react-icons/pi";
import axios from "axios";
import { useSelector } from "react-redux";
import "./posts.scss";
import { REACT_APP_BASE_URL_CLIENT } from "../../config/configClients";
import React, { useEffect, useState } from "react";

const Posts = ({ userId }) => {
  const user = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getRandomPosts();
    console.log("user::::", user);
  }, []);

  const getRandomPosts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found in local storage");
    }

    const baseUrl = REACT_APP_BASE_URL_CLIENT;

    try {
      const response = await axios.get(`${baseUrl}post/random-posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log(response?.data);
      setPosts(response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Server error:", error.response.data);
        throw new Error(
          error.response.data.message || "Failed to fetch posts from server"
        );
      } else if (error.request) {
        console.error("No response received from server:", error.request);
        throw new Error("No response from server. Please try again later.");
      } else {
        console.error("Error:", error.message);
        throw new Error(error.message || "An unexpected error occurred");
      }
    }
  };

  return (
    <div className="posts text-white">
      {posts.length > 0 ? (
        <ul className="space-y-4">
          {posts?.reverse()?.map((post) => {
            const imgURL = `http://localhost:7000/uploads/${post?.img_path}`;

            return (
              <li
                key={post?.id}
                className="bg-[#050708]/30 p-4 rounded-lg shadow"
              >
                <div className="flex items-center gap-3 w-full   justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-[40px] w-[40px] relative overflow-hidden bg-red-400 rounded-full">
                      <img
                        src={`http://localhost:7000/uploads/${user?.ProfilePic_path}`}
                        alt=""
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div>
                      <h2>{user?.name}</h2>
                      <h3 className="text-[12px] opacity-50">
                        {new Date(post?.img_upload_time)?.toLocaleString()}
                      </h3>
                    </div>
                  </div>
                  <div>
                    <BsThreeDotsVertical />
                  </div>
                </div>

                <h3 className="font-bold text-white">
                  {post?.post_description}
                </h3>

                {post?.img_path && (
                  <img
                    src={imgURL}
                    alt={post?.img_name}
                    className="mt-2 max-w-full rounded"
                  />
                )}
                <div className="flex items-center gap-4 h-10">
                  <div>{true ? <BiLike /> : <BiSolidLike />}</div>
                  <div>
                    <FaRegComment />
                  </div>
                  <div>
                    <PiShareFatBold />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
};

export default Posts;
