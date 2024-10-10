import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import { REACT_APP_BASE_URL_CLIENT } from "../../config/configClients";
import axios from "axios";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import { useState, useEffect } from "react";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const userId = parseInt(useLocation().pathname.split("/")[2]);
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
    console.log("---", response.data.data);
    setUserData(response.data.data);
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
  }, []);

  return (
    <div className="profile ">
      <>
        <div className="images">
          <img src={"/upload/" + data?.coverPic} alt="" className="cover" />
          <img
            src={"/upload/" + data?.profilePic}
            alt=""
            className="profilePic"
          />
        </div>
        <div className="profileContainer">
          <div className="uInfo">
            <div className="left">
              <a href="http://facebook.com">
                <FacebookTwoToneIcon fontSize="large" />
              </a>
              <a href="http://facebook.com">
                <InstagramIcon fontSize="large" />
              </a>
              <a href="http://facebook.com">
                <TwitterIcon fontSize="large" />
              </a>
              <a href="http://facebook.com">
                <LinkedInIcon fontSize="large" />
              </a>
              <a href="http://facebook.com">
                <PinterestIcon fontSize="large" />
              </a>
            </div>
            <div className="center">
              <span className=" bg-red-400">Name: {userData?.name}</span>
              <span className="profileDets">Email: {userData?.email}</span>
              <div className="info">
                <div className="item">
                  <PlaceIcon />
                  <span>{userData?.city}</span>
                </div>
                <div className="item">
                  <LanguageIcon />
                  <span>{userData?.website}</span>
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
            <div className="right">
              <EmailOutlinedIcon />
              <MoreVertIcon />
            </div>
          </div>
          <Posts userId={userId} />
        </div>
      </>
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
