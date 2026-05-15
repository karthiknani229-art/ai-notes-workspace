import { useState } from "react";

import axios from "axios";

import {
  Link,
  useNavigate
} from "react-router-dom";

export default function Signup() {

  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const signup = async () => {

    if (!name || !email || !password) {

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
}

if (password.length < 6) {

  return alert(
    "Password must be at least 6 characters"
  );
}

    if (password.length < 6) {

      return alert(
        "Password must be at least 6 characters"
      );
    }

    try {

      await axios.post(
        "https://ai-notes-workspace-vafu.onrender.com/api/auth/signup",
        {
          name,
          email,
          password,
        }
      );

      alert("Signup Successful");

      navigate("/");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Signup Failed"
      );
    }
  };

  return (

    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 shadow-2xl rounded-3xl p-10">

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-white">
            Create Account
          </h1>

          <p className="text-slate-400 mt-3">
            Join your AI-powered productivity workspace
          </p>

        </div>

        <div className="space-y-5">

          <input
            type="text"
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none text-white"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

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
            onClick={signup}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white p-4 rounded-xl font-semibold"
          >
            Create Account
          </button>

        </div>

        <p className="mt-8 text-center text-slate-400">

          Already have an account?{" "}

          <Link
            to="/"
            className="text-blue-400 hover:text-blue-300"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}