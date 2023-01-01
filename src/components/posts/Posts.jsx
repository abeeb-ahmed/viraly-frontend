import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { axiosInstance } from "../../axios";
import Post from "../post/Post";
import "./posts.scss";

const Posts = ({ userId = "" }) => {
  const { isLoading, error, data } = useQuery(["posts"], () =>
    axiosInstance
      .get(userId ? `/posts?userId=${userId}` : "/posts")
      .then((res) => {
        return res.data;
      })
  );

  return (
    <div className="posts">
      {error
        ? "Something went wrong"
        : isLoading
        ? "Loading..."
        : data?.map((post) => <Post post={post} key={post.id} />)}
    </div>
  );
};

export default Posts;
