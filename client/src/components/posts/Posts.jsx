import { FaRegComment } from "react-icons/fa";
import { BiLike } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiSolidLike } from "react-icons/bi";
import { PiShareFatBold } from "react-icons/pi";
import axios from "axios";
import { useSelector } from "react-redux";
import "./posts.scss";
import { REACT_APP_BASE_URL_CLIENT } from "../../config/configClients";
import React, { useEffect, useState, useMemo, useCallback } from "react";

const Posts = ({ userId }) => {
  const user = useSelector((state) => state.user);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const toggleDropdown = (postId) => {
    setOpenDropdownId((prevId) => (prevId === postId ? null : postId));
  };
  // ---------------------------------------------------------------------------

  const fetchPosts = useCallback(
    async (currentPage) => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const baseUrl = REACT_APP_BASE_URL_CLIENT;
      try {
        const response = await axios.get(`${baseUrl}post/feed-posts`, {
          params: {
            userId: user?.id,
            page: currentPage,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const fetchedPosts = response.data;

        if (fetchedPosts.length < 7) {
          setHasMore(false);
        }

        setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const memoizedPosts = useMemo(() => posts, [posts]);

  useEffect(() => {
    if (!loading) {
      fetchPosts(page);
    }
  }, [page]);

  const loadMorePosts = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="posts text-white">
      {memoizedPosts.length > 0 ? (
        <ul className="space-y-4">
          {memoizedPosts?.map((post) => {
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
                        src={`http://localhost:7000/uploads/${post?.ProfilePic_path}`}
                        alt=""
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div>
                      <h2>{post?.userName}</h2>
                      <h3 className="text-[12px] opacity-50">
                        {new Date(post?.img_upload_time)?.toLocaleString()}
                      </h3>
                    </div>
                  </div>
                  <div className="relative ">
                    <BsThreeDotsVertical
                      onClick={() => toggleDropdown(post.id)}
                    />
                    {openDropdownId === post.id && (
                      <div
                        id="dropdown"
                        class="z-10  absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-[#0a0a0a]"
                      >
                        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
                          <li>
                            <a
                              href="#"
                              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Edit
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Delete
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Share
                            </a>
                          </li>
                        </ul>
                      </div>
                    )}
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
        <>
          {loading && <p>Loading...</p>}

          {!loading && hasMore && (
            <button onClick={loadMorePosts}>Load More</button>
          )}

          {!hasMore && <p>No more posts to show.</p>}
        </>
      )}
    </div>
  );
};

export default Posts;
