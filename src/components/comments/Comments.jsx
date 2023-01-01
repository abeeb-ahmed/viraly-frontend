import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import "./comments.scss";
import { AuthContext } from "../../context/AuthContext";
import { axiosInstance } from "../../axios";
import moment from "moment";

const Comments = ({ postId }) => {
  const { currentUser } = useContext(AuthContext);
  const [desc, setDesc] = useState("");

  const queryClient = useQueryClient();

  // comments get request using react query
  const { isLoading, error, data } = useQuery(["comments"], () =>
    axiosInstance.get(`/comments?postId=${postId}`).then((res) => {
      return res.data;
    })
  );

  // add comment post request using react query
  const mutation = useMutation(
    (newComment) => {
      return axiosInstance.post(`/comments?postId=${postId}`, newComment);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments"]);
      },
    }
  );

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!desc) return;

    mutation.mutate({ desc });
    setDesc("");
  };

  return (
    <div className="comments">
      <div className="write">
        <img
          src={
            currentUser.profilePic ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZvmV2bdt-eITXhe_MeJMt4zKRHatRco1AgPedOFkdvQ&s"
          }
          alt=""
        />
        <input
          type="text"
          placeholder="write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleAddComment}>Send</button>
      </div>
      {data?.map((comment) => (
        <div className="comment" key={comment.id}>
          <img
            src={
              comment.profilePicture ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZvmV2bdt-eITXhe_MeJMt4zKRHatRco1AgPedOFkdvQ&s"
            }
            alt=""
          />
          <div className="info">
            <span>{comment.name}</span>
            <p>{comment.desc}</p>
          </div>
          <span className="date">{moment(comment.createdAt).fromNow()}</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
