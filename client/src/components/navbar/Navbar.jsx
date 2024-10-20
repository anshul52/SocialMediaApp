import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import { setUserDetails } from "../../redux/Slice/userProfileDetsSlice";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { REACT_APP_BASE_URL_CLIENT } from "../../config/configClients";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { toggle, darkMode } = useContext(DarkModeContext);
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
    dispatch(setUserDetails(response.data.data));
    return response.data;
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div className="navbar bg-green-400 ">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>lamasocial</span>
        </Link>
        <HomeOutlinedIcon />
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        <GridViewOutlinedIcon />
        <div className="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className="right">
        <a href="/Profile">
          <PersonOutlinedIcon />
        </a>
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />
        <div className="">
          <div className="h-[40px] w-[40px] relative overflow-hidden bg-red-400 rounded-full">
            <img
              src={`http://localhost:7000/uploads/${user?.ProfilePic_path}`}
              alt=""
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
