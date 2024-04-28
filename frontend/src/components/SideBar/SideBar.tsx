import React, { useState, useEffect, useContext } from "react";
import {
  RiProfileLine,
  RiSettings3Line,
  RiLogoutCircleRLine,
} from "react-icons/ri";
import { CiDark, CiLight } from "react-icons/ci";
import logo from "../../assets/logo-dark-removebg-preview (1).png";
import { Link } from "react-router-dom";
import SideBarLinks from "./SideBarLinks";
import { AuthContext } from "../../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import { changeChatTheme } from "../../redux/slices/userSlice";

const SideBar: React.FC = () => {
  const [actions, setActions] = useState<boolean>(false);

  const { darkMode } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const { user, setToken, setUser } = useContext(AuthContext);

  useEffect(() => {
    if (darkMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode, user]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleClickOutside = () => {
    setActions(false);
  };

  const logout = () => {
    localStorage.removeItem("chatToken");

    setToken("");
    setUser(null);
  };

  return (
    <nav className="lg:w-[75px] z-50 max-md:w-full fixed  md:min-h-screen">
      <div className="relative md:min-h-screen flex md:flex-col sm:flex-row sm:py-2 sm:px-2 md:px-4 md:py-4 justify-between items-center shadow lg:relative z-40 bottom-0 bg-white dark:bg-zinc-600 ">
        <div className="logo max-md:hidden md:block">
          <img src={logo} className=" h-9 " alt="logo" />
        </div>

        <SideBarLinks />

        <div className="md:flex flex-col max-md:hidden items-center gap-3">
          <div>
            <span
              onClick={() => dispatch(changeChatTheme(undefined))}
              className=" block text-4xl w-10 h-10 text-gray-400 cursor-pointer"
            >
              {darkMode === "dark" ? <CiLight /> : <CiDark />}
            </span>
          </div>
          <div
            className=" avatar cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setActions(!actions);
            }}
          >
            <div className="w-10">
              <img
                src={user?.profilePic}
                className=" p-1 rounded-full  bg-gray-50 dark:bg-zinc-700 object-cover "
                alt={user?.username}
              />
            </div>
          </div>
        </div>

        <div
          className="max-md:block hidden pr-7 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setActions(!actions);
          }}
        >
          <img
            src={user?.profilePic}
            className="w-10 h-10 p-1  rounded-full bg-gray-50 dark:bg-zinc-700 object-cover "
            alt={user?.username}
          />
        </div>

        {actions && (
          <ul className="absolute actions bottom-8 left-3 max-md:top-20 max-md:left-2/3 max-sm:left-[50%] z-50 w-40 max-md:h-36 overflow-hidden py-2 mx-4 mb-12 text-left list-none bg-white border-none rounded-lg shadow-lg  dark:bg-zinc-700 ">
            <li className=" cursor-pointer w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent  whitespace-nowrap hover:bg-gray-100/30 dark:text-gray-100 dark:hover:bg-zinc-600/50">
              <Link to="/profile" className="flex items-center justify-between">
                Profile
                <span className="text-gray-500 float-right text-base">
                  <RiProfileLine />
                </span>
              </Link>
            </li>

            <li className="cursor-pointer w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent whitespace-nowrap hover:bg-gray-100/30 dark:text-gray-100 dark:hover:bg-zinc-600/50">
              <Link
                to="/settings"
                className="flex items-center justify-between"
              >
                Setting
                <span className="text-gray-500 float-right text-base">
                  <RiSettings3Line />
                </span>
              </Link>
            </li>

            <li className="my-2 border-b border-gray-100/20 bg-inherit"></li>

            <li
              onClick={logout}
              className="flex items-center justify-between cursor-pointer w-full px-4 py-2  text-sm font-normal text-gray-700 bg-inherit whitespace-nowrap hover:bg-gray-100/30 dark:text-gray-100 dark:hover:bg-zinc-600/50"
            >
              Log out
              <span className="text-gray-500 float-right text-base">
                <RiLogoutCircleRLine />
              </span>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default React.memo(SideBar);
