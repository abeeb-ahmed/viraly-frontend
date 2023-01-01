import Posts from "../../components/posts/Posts";
import Share from "../../components/share/Share";
import "./home.scss";

const Home = () => {
  return (
    <div className="home">
      {/* story will be added here later */}
      <Share />
      <Posts />
    </div>
  );
};

export default Home;
