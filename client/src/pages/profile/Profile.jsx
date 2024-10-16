import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import {
  REACT_APP_BASE_URL_CLIENT,
  IMAGE_PATH_URL,
} from "../../config/configClients";
import axios from "axios";
import { MdEdit } from "react-icons/md";
import TwitterIcon from "@mui/icons-material/Twitter";
import { useSelector, useDispatch } from "react-redux";
import {
  setUserDetails,
  updateProfilePic,
} from "../../redux/Slice/userProfileDetsSlice";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import { useState, useEffect } from "react";
import UserPostList from "../../components/profile/UserPostList";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const userId = JSON.parse(localStorage.getItem("users_dets"))?.id;
  const [userData, setUserData] = useState({
    username: "",
    id: null,
    email: "",
    name: "",
    coverPic: null,
    profilePic: null,
    city: null,
    website: null,
  });
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${REACT_APP_BASE_URL_CLIENT}users/getuser`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    // console.log("---", response.data.data);
    setUserData(response.data.data);
    dispatch(setUserDetails(response.data.data));
    return response.data;
  };
  const { isLoading, error, data } = useQuery(
    ["user"],
    // makeRequest.get("/users/find/" + userId).then((res) => {
    //   return res.data;
    // })
    () => fetchUser()
  );

  const { isLoading: rIsLoading, data: relationshipData } = useQuery(
    ["relationship"],
    () =>
      makeRequest.get("/relationships?followedUserId=" + userId).then((res) => {
        return res.data;
      })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (following) => {
      if (following)
        return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/relationships", { userId });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["relationship"]);
      },
    }
  );

  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser?.id));
  };
  useEffect(() => {
    const data = fetchUser();
    setUserData(data);
    console.log("IMAGE_PATH_URL:::", process.env.IMAGE_PATH_BASE_URL);
  }, []);

  return (
    <div className="profile  max-h-screen overflow-y-auto dark-scrollbar">
      <div className="p-4 text-[20px] text-[#fff]">
        <h1>Profile</h1>
      </div>
      <>
        {/* <div className="images">
          <img src={"/upload/" + data?.coverPic} alt="" className="cover" />
          <img
            src={"/upload/" + data?.profilePic}
            alt=""
            className="profilePic"
          />
        </div> */}
        <div className="p-6">
          <div className=" rounded-[5px] overflow-hidden bg-[#222222] text-[#fff]/80 ">
            <div className="flex w-full p-5 justify-between">
              <div className="w-[80%] flex gap-5">
                <div className=" ">
                  <div className="h-[100px] relative overflow-hidden w-[100px] bg-[#333333] rounded-full ">
                    <div className="absolute flex justify-end p-2 bottom-0 w-full h-1/2 bg-gray-700/70 right-0 opacity-0 hover:opacity-100">
                      <MdEdit className="" />
                    </div>
                    <img
                      src={`http://localhost:7000/uploads/${user?.ProfilePic_path}`}
                      alt=""
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>
                <div className=" flex flex-col  ">
                  <span className=" ">Name: {user?.name}</span>
                  <span className="profileDets">Email: {user?.email}</span>
                  <div className="">
                    <div className="">
                      <PlaceIcon />
                      <span>{user?.city}</span>
                    </div>
                    <div className="">
                      <LanguageIcon />
                      <span>
                        <a href={user?.website}>Website</a>
                      </span>
                    </div>
                  </div>
                  {rIsLoading ? (
                    "loading"
                  ) : userId === currentUser.id ? (
                    <button onClick={() => setOpenUpdate(true)}>update</button>
                  ) : (
                    <button onClick={handleFollow}>
                      {relationshipData?.includes(currentUser?.id)
                        ? "Following"
                        : "Follow"}
                    </button>
                  )}
                </div>
              </div>
              <div className="w-[20%] flex items-start justify-end">
                <EmailOutlinedIcon />
                <MoreVertIcon />
              </div>
            </div>
            <div className="w-full flex items-center justify-end p-3 bg-[#222222]">
              <a href="http://facebook.com">
                <FacebookTwoToneIcon fontSize="large" className="scale-[.5]" />
              </a>
              <a href="http://facebook.com">
                <InstagramIcon fontSize="large" className="scale-[.5]" />
              </a>
              <a href="http://facebook.com">
                <TwitterIcon fontSize="large" className="scale-[.5]" />
              </a>
              <a href="http://facebook.com">
                <LinkedInIcon fontSize="large" className="scale-[.5]" />
              </a>
              <a href="http://facebook.com">
                <PinterestIcon fontSize="large" className="scale-[.5]" />
              </a>
            </div>
          </div>
          <Posts userId={userId} />
        </div>
      </>

      <hr className=" border-t-[2px] border-t-[#050708]/30" />
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
      {userId && <UserPostList userId={userId} />}
    </div>
  );
};

export default Profile;
