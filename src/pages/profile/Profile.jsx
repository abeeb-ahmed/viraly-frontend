import "./profile.scss";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import Posts from "../../components/posts/Posts";
import { useLocation } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { axiosInstance } from "../../axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Update from "../../components/update/Update";

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [updateOpen, setUpdateOpen] = useState(false);
  const location = useLocation();
  const userId = parseInt(location.pathname.split("/")[2]);

  const queryClient = useQueryClient();

  const userQuery = useQuery(["user"], () =>
    axiosInstance.get(`/users/find/${userId}`).then((res) => {
      return res.data;
    })
  );

  const relationshipsQuery = useQuery(["relationships"], () =>
    axiosInstance.get(`/relationships?followedUserId=${userId}`).then((res) => {
      return res.data;
    })
  );

  // post request to follow
  const postMutation = useMutation(
    () => {
      return axiosInstance.post("/relationships", { followedUserId: userId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["relationships"]);
      },
    }
  );

  // delete request to unfollow
  const deleteMutation = useMutation(
    (userId) => {
      const res = axiosInstance.delete(
        `/relationships?followedUserId=${userId}`
      );
      console.log(res);
      return res;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["relationships"]);
      },
    }
  );

  // handle follow and unfollow
  const handleFollow = () => {
    relationshipsQuery.data?.includes(currentUser.id)
      ? deleteMutation.mutate(userId)
      : postMutation.mutate();
  };

  return (
    <div className="profile">
      {userQuery.isLoading || relationshipsQuery.isLoading ? (
        "Loading..."
      ) : (
        <>
          <div className="images">
            <img
              src={
                userQuery.data?.coverPic ||
                "https://images.pexels.com/photos/13440765/pexels-photo-13440765.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              }
              alt=""
              className="cover"
            />
            <img
              src={
                userQuery.data?.profilePic ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZvmV2bdt-eITXhe_MeJMt4zKRHatRco1AgPedOFkdvQ&s"
              }
              alt=""
              className="profilePic"
            />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="center">
                <span>{userQuery.data?.name}</span>
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    <span>{userQuery.data?.city}</span>
                  </div>
                  <div className="item">
                    <LanguageIcon />
                    <span>{userQuery.data?.website}</span>
                  </div>
                </div>
                {currentUser.id === userQuery.data.id ? (
                  <button onClick={() => setUpdateOpen(true)}>Update</button>
                ) : (
                  <button onClick={handleFollow}>
                    {relationshipsQuery.data?.includes(currentUser.id)
                      ? "Unfollow"
                      : "follow"}
                  </button>
                )}
              </div>
            </div>
            <Posts userId={userId} />
          </div>
          {updateOpen && <Update setUpdateOpen={setUpdateOpen} />}
        </>
      )}
    </div>
  );
};

export default Profile;
