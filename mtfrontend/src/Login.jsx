import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try{
      const response = await axios.post(
            "http://localhost:8000/login", 
            { email, password },          
            { withCredentials: true }     
          );
      if (response.data.status === "ok"){
        console.log("Login Successful!",response.data.message);
        navigate("/dashboard");
      }
    }catch (err) {
      console.error("Login Error: ", err.response?.data || err.message);
    }
  };

  return (
    <div className="login-page">
        <div className="wave-container">
            <svg className="wave-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 100" preserveAspectRatio="none">
                <path className="wave-path" d="M0,50 Q150,20 300,50 T600,50 T900,50 T1200,50"></path>
            </svg>
        </div>

      <div className="login-card">
        <h2 className="login-title">Life Thread</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <br></br>
          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="login-footer">
          Don't have an account? <a href="#">Sign Up</a>
        </p>
      </div>
    
    </div>
  );
}

export default Login;


