import "./update.scss";
import CloseIcon from "@mui/icons-material/Close";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { axiosInstance } from "../../axios";
import { storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const Update = ({ setUpdateOpen }) => {
  const { currentUser, updateUser } = useContext(AuthContext);

  const userQuery = useQuery(["user"], () =>
    axiosInstance.get(`/users/find/${currentUser.id}`).then((res) => {
      return res.data;
    })
  );

  const [name, setName] = useState(userQuery.data.name);
  const [username, setUsername] = useState(userQuery.data.username);
  const [email, setEmail] = useState(userQuery.data.email);
  const [city, setCity] = useState(userQuery.data.city);
  const [website, setWebsite] = useState(userQuery.data.website);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePic, setProfilePic] = useState(userQuery.data.profilePic);
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  // handle update request to mysql
  const mutation = useMutation(
    (updatedUser) => {
      return axiosInstance.put("/users", updatedUser);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);
      },
    }
  );

  // handle image upload
  const uploadImage = async (file) => {
    return new Promise((resolve, reject) => {
      // Upload file and metadata
      const storageRef = ref(
        storage,
        "images/" + currentUser.name + Date.now()
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
          reject(error);
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            mutation.mutate({
              username,
              email,
              name,
              website,
              city,
              profilePic: downloadURL,
            });
            setName("");
            setUsername("");
            setEmail("");
            setWebsite("");
            setCity("");
            setProfilePic("");
            setProfilePic(null);
            setIsLoading(false);
            setUpdateOpen(false);
          });
        }
      );
    });
  };

  // handle user profile update
  const handleUpdate = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    profilePicFile
      ? await uploadImage(profilePicFile)
      : mutation.mutate({
          username,
          email,
          name,
          website,
          city,
          profilePic,
        });
    updateUser({ username, email, name, website, city, profilePic });

    setName("");
    setUsername("");
    setEmail("");
    setWebsite("");
    setCity("");
    setProfilePic("");
    setProfilePicFile(null);
    setIsLoading(false);
    setUpdateOpen(false);
  };

  return (
    <div className="update">
      <div className="container">
        <h2>Update</h2>
        <CloseIcon className="close" onClick={() => setUpdateOpen(false)} />

        <form action="post">
          <div className="row">
            <label>Name</label>
            <input
              type="text"
              placeholder={`${userQuery.data.name || ""}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="row">
            <label>Username</label>
            <input
              type="text"
              placeholder={`${userQuery.data.name || ""}`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="row">
            <label>Email</label>
            <input
              type="text"
              placeholder={`${userQuery.data.email || ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="row">
            <label>City</label>
            <input
              type="text"
              placeholder={`${userQuery.data.city || ""}`}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="row">
            <label>Website</label>
            <input
              type="text"
              placeholder={`${userQuery.data.website || ""}`}
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <div className="row">
            <label>Profile Picture</label>
            <input
              type="file"
              name="profilePic"
              id="profilePic"
              accept="image/*"
              onChange={(e) => setProfilePicFile(e.target.files[0])}
            />
          </div>
          <button disabled={isLoading} onClick={handleUpdate}>
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default Update;
