import React, { useEffect, useState } from "react";
import axios from "axios";
import { BiSolidLike } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { FaRegComment } from "react-icons/fa";
import { BiLike } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IMAGE_PATH_URL } from "../../config/configClients";
import { PiShareFatBold } from "react-icons/pi";

const UserPostList = ({ userId }) => {
  const user = useSelector((state) => state.user);
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
      <div className="w-full mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold ">
          {/* Posts by User ID: {userId} */}
          Your all post
        </h2>
        <button
          type="button"
          class="text-white bg-[#050708]/30 hover:bg-[#24292F]/90 mr-10 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 my-2"
        >
          <a href="/PostUpload">Upload New Post</a>
        </button>
      </div>
      {error && <div className="text-red-500">{error}</div>}
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

              <h3 className="font-bold text-white">{post?.post_description}</h3>

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
    </div>
  );
};

export default UserPostList;
