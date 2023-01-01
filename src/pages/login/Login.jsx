import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./login.scss";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/login",
        {
          username,
          password,
        },
        { withCredentials: true }
      );

      login(res.data[0]);
      navigate("/");
    } catch (error) {
      console.log(error);
      alert(error);
      setPassword("");
      setPassword("");
    }
    setLoading(false);
  };

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Hello World.</h1>
          <p>
            Connect to the world on Viraly. Get updates, and keep in touch with
            your family and friends.
          </p>
          <span>Don't you have an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin} disabled={loading}>
              Login
            </button>
            <span className="mobile">
              Don't have an account?
              <Link to="/register" style={{ textDecoration: "none" }}>
                <span> Register</span>
              </Link>
            </span>
            {error && error.response.data}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
