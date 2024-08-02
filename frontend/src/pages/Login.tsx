import logo from "../assets/logo-dark-removebg-preview (1).png";
import { useState, useEffect, useContext } from "react";
import { RiUser2Line, RiLock2Line } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useLogin from "../hooks/useLogin";
import Loader from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import { BsEye, BsEyeSlash } from "react-icons/bs";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isShown, setIsShown] = useState<boolean>(false);

  const navigate = useNavigate();
  const { loading, login } = useLogin();

  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      navigate("/");
      toast("You already logged in", {
        icon: "😒",
      });
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      if (password.length >= 6) {
        await login(email, password);
      } else {
        toast.error("Password must be at least 6 characters");
      }
    } else {
      toast.error("Please Enter A Vaild Email");
    }
  };
  return (
    <div className=" absolute bg-white z-50 w-full min-h-screen left-0 top-0 flex flex-col items-center justify-center h-screen">
      <div className="mb-10 text-center flex items-center gap-2">
        <img className=" w-12" src={logo} alt="logo" />
        <h2 className="text-xl font-bold text-gray-800">BGChat</h2>
      </div>

      <div className="flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-2 text-gray-800 ">Sign in</h2>
        <p className="mb-6 text-gray-500 ">Sign in to continue to BGChat.</p>
      </div>

      <div className="bg-white border w-[350px] border-gray-200  rounded">
        <form className="p-9" onSubmit={handleSubmit}>
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
                className="w-full outline-none text-black bg-slate-50/50 text-14 focus:ring- border-gray-100 rounded rounded-l-none placeholder:text-base text-base"
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
              <div className=" relative w-full">
                <input
                  type={isShown ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className=" w-[88%] outline-none text-black border-gray-100 rounded rounded-l-none placeholder:text-14 bg-slate-50/50 text-14 focus:ring-0 "
                />
                {isShown ? (
                  <BsEyeSlash
                    onClick={() => setIsShown(!isShown)}
                    className=" text-base text-gray-500 hover:text-gray-800 cursor-pointer absolute right-2 top-1"
                  />
                ) : (
                  <BsEye
                    onClick={() => setIsShown(!isShown)}
                    className=" text-base text-gray-500 hover:text-gray-800 cursor-pointer absolute right-2 top-1"
                  />
                )}
              </div>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="py-2 w-full text-white border-none  btn bg-violet-500 hover:bg-violet-600 text-base"
            >
              {loading ? <Loader /> : "Sign in"}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-10 text-center">
        <p className="mb-5 text-gray-700 ">
          Don't have an account?
          <Link to="/signup" className="font-medium text-violet-500">
            {" "}
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
