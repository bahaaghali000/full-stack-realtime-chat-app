import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo-dark-removebg-preview (1).png";
import { RiUser2Line, RiLock2Line, RiMailLine } from "react-icons/ri";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase.config";
import { setDoc, doc } from "firebase/firestore";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const SignUp: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const user = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.uid) {
      navigate("/");
      toast("You already logged in", {
        icon: "😒",
      });
    }
  }, [user?.uid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", user.user.uid), {
        uid: user.user.uid,
        displayName: username,
        email,
        password,
        photoURL:
          "https://firebasestorage.googleapis.com/v0/b/bgchat-104fc.appspot.com/o/default-avatar-profile-icon-vector-social-media-user-image-700-205124837.jpg?alt=media&token=8c541396-ad70-447c-be96-1f6aa9da512b",
      });
      navigate("/");
      toast.success("User created successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className=" flex flex-col items-center justify-center h-screen ">
      <div className="mb-10 mt-3 text-center flex items-center gap-2">
        <img className=" w-12" src={logo} alt="logo" />
        <h2 className="text-xl font-bold text-gray-800">BGChat</h2>
      </div>

      <div className="heading flex flex-col items-center">
        <h2 className=" text-lg font-semibold mb-2 text-gray-800">Sign up</h2>
        <p className="mb-6 text-gray-500 ">Get your Chatvia account now.</p>
      </div>

      <div className="bg-white border border-gray-200 ">
        <div className="p-5 ">
          <form className="p-4" onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="email" className="font-medium text-gray-700 ">
                Email
              </label>
              <div className="flex items-center border border-gray-200 mt-2 mb-3 rounded-3 bg-slate-50/50">
                <span className="flex items-center px-4 py-2 text-gray-500 border border-r-0 border-gray-100 rounded rounded-r-none">
                  <RiMailLine />
                </span>
                <input
                  type="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                  className="w-full outline-none border-gray-100 rounded rounded-l-none placeholder:text-14 bg-slate-50/50 text-14 focus:ring-0"
                />
              </div>
            </div>

            <div className="mb-5">
              <label htmlFor="username" className="font-medium text-gray-700 ">
                Username
              </label>
              <div className="flex items-center border border-gray-200 mt-2 mb-3 rounded-3 bg-slate-50/50 ">
                <span className="flex items-center px-4 py-2 text-gray-500 border border-r-0 border-gray-100 rounded rounded-r-none ">
                  <RiUser2Line />
                </span>
                <input
                  type="text"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter Username"
                  className="w-full outline-none border-gray-100 rounded rounded-l-none placeholder:text-14 bg-slate-50/50 text-14 focus:ring-0"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="font-medium text-gray-700 ">
                Password
              </label>
              <div className="flex items-center border border-gray-200 mt-2 mb-3 rounded-3 bg-slate-50/50 ">
                <span className="flex items-center px-4 py-2 text-gray-500 border border-r-0 border-gray-100 rounded rounded-r-none ">
                  <RiLock2Line />
                </span>
                <input
                  type="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full outline-none border-gray-100 rounded rounded-l-none placeholder:text-14 bg-slate-50/50 text-14 focus:ring-0"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="py-2 w-full text-white btn  bg-violet-500 hover:bg-violet-600 text-lg"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-10 text-center">
        <p className="mb-5 text-gray-700 ">
          Have an account?{" "}
          <Link to="/login" className=" font-medium text-violet-500">
            Signin
          </Link>
        </p>
        <p className="text-gray-700 ">
          ©{new Date().getFullYear()} BGChat. Crafted with by bahaaghali000
        </p>
      </div>
    </div>
  );
};

export default SignUp;
