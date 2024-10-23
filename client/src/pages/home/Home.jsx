import Stories from "../../components/stories/Stories";
import Posts from "../../components/posts/Posts";
import Share from "../../components/share/Share";
import "./home.scss";

const Home = () => {
  return (
    <div className="px-[20px] h-[100vh] overflow-y-scroll dark-scrollbar pt-[20px]">
      <Stories />
      <Share />
      <Posts />
    </div>
  );
};

export default Home;
