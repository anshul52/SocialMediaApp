import Stories from "../../components/stories/Stories";
import Posts from "../../components/posts/Posts";
import Share from "../../components/share/Share";
import "./home.scss";

const Home = () => {
  return (
    // <div className="home bg-[#333333]">
    <div className="home bg-green-400">
      <Stories />
      <Share />
      <Posts />
    </div>
  );
};

export default Home;
