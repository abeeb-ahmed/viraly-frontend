import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { axiosInstance } from "../../axios";
import "./register.scss";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClick = async (e) => {
    if (!username || !email || !name || !password) return;
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/auth/register", {
        username,
        name,
        email,
        password,
      });
    } catch (error) {
      setError(error.response.data);
      setEmail("");
      setName("");
      setPassword("");
      setUsername("");
    }
    setLoading(false);

    navigate("/login");
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Viraly</h1>
          <p>
            Connect to the world on Viraly. Get updates, and keep in touch with
            your family and friends.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input
              required
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              placeholder="Username"
            />
            <input
              required
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Email"
            />
            <input
              required
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Password"
            />
            <input
              required
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Name"
            />
            <button onClick={handleClick} disabled={loading}>
              Register
            </button>
            <span className="mobile">
              Already have an account?
              <Link to="/login" style={{ textDecoration: "none" }}>
                <span> Login</span>
              </Link>
            </span>
            {error && error}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
