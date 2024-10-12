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
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload Post</h2>
      <form onSubmit={handleSubmit}>
        {/* <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            User ID:
          </label>
          <input
            type="number"
            value={localStorage.getItem("users_dets").id}
            onChange={(e) => setUserId(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div> */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Post Description:
          </label>
          <textarea
            value={postDescription}
            onChange={(e) => setPostDescription(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Image:
          </label>
          <input
            type="file"
            accept="image/jpeg, image/png, application/pdf"
            onChange={handleFileChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
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
  );
};

export default PostUpload;
