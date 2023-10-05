import logo from "../assets/logo-dark-removebg-preview (1).png";
import { useState, useEffect } from "react";
import { RiUser2Line, RiLock2Line } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.config";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const user = useAuth();

  useEffect(() => {
    console.log(user);
    if (user?.uid) {
      navigate("/");
      toast("You already logged in", {
        icon: "😒",
      });
    }
  }, [user?.uid]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/");
        toast.success("logged in successfully");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <div className="mb-10 text-center flex items-center gap-2">
        <img className=" w-12" src={logo} alt="logo" />
        <h2 className="text-xl font-bold text-gray-800">BGChat</h2>
      </div>

      <div className="heading flex flex-col items-center">
        <h2 className=" text-lg font-semibold mb-2 text-gray-800 ">Sign in</h2>
        <p className="mb-6 text-gray-500 ">Sign in to continue to BGChat.</p>
      </div>

      <div className="bg-white border border-gray-200  rounded">
        <div className="p-5 ">
          <form className="p-4" onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="email" className="font-medium text-gray-700 ">
                Email
              </label>
              <div className="flex items-center border rounded border-gray-200 mt-2 mb-3 rounded-3 bg-slate-50/50">
                <span className="flex items-center px-4 py-2 text-gray-500 border border-r-1 border-gray-100 rounded rounded-r-none ">
                  <RiUser2Line />
                </span>
                <input
                  type="text"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                  className="w-full outline-none border-gray-100 rounded rounded-l-none placeholder:text-base text-base focus:ring-0"
                />
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="font-medium text-gray-700 ">
                Password
              </label>
              <div className="flex items-center rounded border border-gray-200 mt-2 mb-3 rounded-3 bg-slate-50/50 ">
                <span className="flex items-center px-4 py-2 text-gray-500 border border-r-0 border-gray-100 rounded rounded-r-none">
                  <RiLock2Line />
                </span>
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full outline-none border-gray-100 rounded rounded-l-none placeholder:text-14 bg-slate-50/50 text-14 focus:ring-0 "
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="py-2 w-full text-white btn bg-violet-500 hover:bg-violet-600 text-lg"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-10 text-center">
        <p className="mb-5 text-gray-700 ">
          Don't have an account?
          <Link to="/signup" className="font-medium text-violet-500">
            Signup now
          </Link>
        </p>
        <p className="text-gray-700 ">
          © {new Date().getFullYear()} BGChat. Crafted with by bahaaghali000
        </p>
      </div>
    </div>
  );
};

export default Login;
