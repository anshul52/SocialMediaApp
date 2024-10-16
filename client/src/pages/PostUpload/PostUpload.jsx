import React, { useState } from "react";
import axios from "axios";

const PostUpload = () => {
  const [userId, setUserId] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    console.log(
      "localStorage.::::",
      JSON.parse(localStorage.getItem("users_dets")).id
    );

    const formData = new FormData();
    formData.append(
      "user_id",
      JSON.parse(localStorage.getItem("users_dets"))?.id
    );
    formData.append("post_description", postDescription);
    formData.append("image", image);
    console.log("formData::::", formData);

    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        process.env.REACT_APP_BASE_URL_CLIENT + "users/postUpload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccessMessage(response.data.message);
      setUserId("");
      setPostDescription("");
      setImage(null);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="max-w-md mx-auto p-6 bg-[#222222] text-white rounded-lg shadow-md w-[50%]">
        <h2 className="text-xl font-semibold mb-4">Upload Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white/80 text-sm font-bold mb-2">
              Post Description:
            </label>
            <textarea
              value={postDescription}
              onChange={(e) => setPostDescription(e.target.value)}
              required
              className="shadow bg-[#333333] appearance-none border rounded w-full py-2 px-3 text-white leading-tight outline-none focus:shadow-outline"
            />
          </div>
          {/* upload */}
          <div className="mb-4">
            <label className="block text-white/80 text-sm font-bold mb-2">
              Image:
            </label>
            <div class="flex relative items-center justify-center w-full">
              <label
                for="dropzone-file"
                class="flex flex-col items-center justify-center w-full h-44 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-[#333333] hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-[#333333]"
              >
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span class="font-semibold">Click to upload</span> or drag
                    and drop
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
                <input id="dropzone-file" type="file" class="hidden" />
              </label>
              <input
                type="file"
                accept="image/jpeg, image/png, application/pdf"
                onChange={handleFileChange}
                required
                className="shadow absolute h-full opacity-0 appearance-none border rounded w-full py-2 px-3 bg-[#333333] text-white leading-tight outline-none focus:shadow-outline"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Upload Post
          </button>
        </form>
        {error && <div className="mt-4 text-red-500">{error}</div>}
        {successMessage && (
          <div className="mt-4 text-green-500">{successMessage}</div>
        )}
      </div>
    </div>
  );
};

export default PostUpload;
