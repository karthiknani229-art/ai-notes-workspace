import { useState } from "react";

import axios from "axios";

import {
  Link,
  useNavigate
} from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const login = async () => {

    if (!email || !password) {

  return alert(
    "Please fill all fields"
  );
}

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {

  return alert(
    "Please enter valid email"
  );


      return alert(
        "Please fill all fields"
      );
    }

    try {

      const res = await axios.post(
        "https://ai-notes-workspace-vafu.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      navigate("/dashboard");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Login Failed"
      );
    }
  };

  return (

    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 shadow-2xl rounded-3xl p-10">

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-white">
            AI Notes Workspace
          </h1>

          <p className="text-slate-400 mt-3">
            Smart collaborative AI note management
          </p>

        </div>

        <div className="space-y-5">

          <input
            type="email"
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none text-white"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none text-white"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            onClick={login}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white p-4 rounded-xl font-semibold"
          >
            Login
          </button>

        </div>

        <p className="mt-8 text-center text-slate-400">

          Don't have an account?{" "}

          <Link
            to="/signup"
            className="text-blue-400 hover:text-blue-300"
          >
            Signup
          </Link>

        </p>

      </div>

    </div>
  );
}