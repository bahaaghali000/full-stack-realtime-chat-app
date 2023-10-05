import React, { useState, useEffect } from "react";
import {
  RiUser2Line,
  RiMessage3Line,
  RiContactsLine,
  RiSettings2Line,
  RiSunLine,
  RiMoonClearLine,
  RiProfileLine,
  RiSettings3Line,
  RiLogoutCircleRLine,
  RiInformationLine,
} from "react-icons/ri";

import logo from "../assets/logo-dark-removebg-preview (1).png";
import useAuth from "../hooks/useAuth";

import { signOut } from "firebase/auth";
import { auth } from "../firebase.config";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SlideBar: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [actions, setActions] = useState<boolean>(false);

  const user = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const logout = () => {
    signOut(auth)
      .then(() => {
        toast.success("Logout successfully");
        navigate("/login");
      })
      .catch((err) => toast.error(err.message));
  };

  const activtion = (att: string, tab: string) => {
    const tabsBtns = document.querySelectorAll(".tab-button");
    const tabs = document.querySelectorAll(".tab-content");

    tabs.forEach((tab) => {
      tab.classList.remove("tab-active");
    });

    tabsBtns.forEach((btn) => {
      btn.classList.remove("active");
    });

    document.getElementById(att)?.classList.add("tab-active");
    document.getElementById(tab)?.classList.add("active");
    setActions(false);
  };

  return (
    <div className="slide-bar relative flex md:flex-col sm:flex-row sm:py-2 sm:px-2 md:px-4 md:py-4 justify-between items-center lg:w-[75px] shadow lg:relative z-40 bottom-0 bg-white dark:bg-zinc-600 ">
      <div className="logo max-md:hidden md:block">
        <img src={logo} className=" h-9 " alt="logo" />
      </div>

      <div className="links max-md:flex max-md:w-full md:block">
        <div
          id="profile-tab"
          className="tab-button flex relative cursor-pointer items-center justify-center mx-auto h-14 w-14 leading-[14px] group/tab my-2 rounded-lg dark:text-slate-300 hover:bg-slate-700"
          onClick={() => activtion("profile", "profile-tab")}
        >
          <RiUser2Line fontSize={"1.5rem"} />
        </div>

        <div
          id="chats-content-tab"
          className="tab-button active flex relative cursor-pointer items-center justify-center mx-auto h-14 w-14 leading-[14px] group/tab my-2 rounded-lg dark:text-slate-300 hover:bg-slate-700 "
          onClick={() => activtion("chats-content", "chats-content-tab")}
        >
          <RiMessage3Line fontSize={"1.5rem"} />
        </div>

        <div
          id="users-tab"
          onClick={() => activtion("users", "users-tab")}
          className="tab-button flex relative cursor-pointer items-center justify-center mx-auto h-14 w-14 leading-[14px] group/tab my-2 rounded-lg dark:text-slate-300 hover:bg-slate-700 "
        >
          <RiContactsLine fontSize={"1.5rem"} />
        </div>

        <div
          id="about-tab"
          className="tab-button flex relative cursor-pointer items-center justify-center mx-auto h-14 w-14 leading-[14px] group/tab my-2 rounded-lg dark:text-slate-300 hover:bg-slate-700 "
          onClick={() => activtion("about", "about-tab")}
        >
          <RiInformationLine fontSize={"1.5rem"} />
        </div>

        <div
          id="settings-tab"
          onClick={() => activtion("settings", "settings-tab")}
          className="tab-button flex relative cursor-pointer items-center justify-center mx-auto h-14 w-14 leading-[14px] group/tab my-2 rounded-lg dark:text-slate-300 hover:bg-slate-700 "
        >
          <RiSettings2Line fontSize={"1.5rem"} />
        </div>

        <div className="relative cursor-pointer items-center justify-center mx-auto h-14 w-14 mt-2 md:hidden max-md:flex">
          <img
            src={user?.photoURL}
            onClick={() => setActions(!actions)}
            className="w-10 h-10w-10 h-10 p-1  rounded-full bg-gray-50 dark:bg-zinc-700 object-cover "
            alt=""
          />
        </div>
      </div>

      <div className="md:flex flex-col max-md:hidden items-center gap-3">
        <span
          className=" flex cursor-pointer items-center justify-center mx-auto h-14 w-14 leading-[14px] group/tab my-2 rounded-lg dark:text-slate-300  "
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? (
            <RiSunLine fontSize={"1.5rem"} />
          ) : (
            <RiMoonClearLine fontSize={"1.5rem"} />
          )}
        </span>

        <div className="cursor-pointer" onClick={() => setActions(!actions)}>
          <img
            src={user?.photoURL}
            className="w-10 h-10w-10 h-10 p-1  rounded-full bg-gray-50 dark:bg-zinc-700 object-cover "
            alt=""
          />
        </div>
      </div>

      {actions && (
        <ul className="absolute actions bottom-8 left-3 max-md:top-20 max-md:left-2/3 z-50 w-40 max-md:h-36 overflow-hidden py-2 mx-4 mb-12 text-left list-none bg-white border-none rounded-lg shadow-lg  dark:bg-zinc-700 ">
          <li
            onClick={() => activtion("profile", "profile-tab")}
            className="flex items-center justify-between cursor-pointer w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent  whitespace-nowrap hover:bg-gray-100/30 dark:text-gray-100 dark:hover:bg-zinc-600/50"
          >
            Profile
            <span className="text-gray-500 float-right text-base">
              <RiProfileLine />
            </span>
          </li>

          <li
            onClick={() => activtion("settings", "settings-tab")}
            className="flex items-center justify-between cursor-pointer w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent whitespace-nowrap hover:bg-gray-100/30 dark:text-gray-100 dark:hover:bg-zinc-600/50"
          >
            Setting
            <span className="text-gray-500 float-right text-base">
              <RiSettings3Line />
            </span>
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
  );
};

export default React.memo(SlideBar);
