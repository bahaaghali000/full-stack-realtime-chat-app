import React from "react";
import { Link } from "react-router-dom";

import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";

import { RiArrowLeftSLine } from "react-icons/ri";

const Navbar: React.FC = () => {
  const { userData } = useSelector((state: RootState) => state.user);

  const handleClick = () => {
    document.querySelector(".chat")?.classList.remove("chat-show");
    document.querySelector(".chat")?.classList.add("chat-container");
    document.querySelector(".slide-bar")?.classList.remove("slide-hiden");
  };

  return (
    <div className="p-4 max-md:py-1 border-b border-gray-100 lg:p-6 dark:border-zinc-600">
      <div className="grid items-center grid-cols-12">
        <div className="col-span-8 sm:col-span-4">
          <div className="flex items-center gap-3">
            <div
              className="cursor-pointer max-md:block hidden"
              onClick={handleClick}
            >
              <span className="p-2 text-gray-500 text-base">
                <RiArrowLeftSLine />
              </span>
            </div>
            <img
              className="rounded-full h-10 w-10 object-cover"
              src={userData.photoURL ? userData.photoURL : ""}
              alt=""
            />
            <div>
              <h5 className="mb-0 truncate text-base font-semibold">
                <Link className="text-gray-800 dark:text-gray-50" to="/">
                  {userData.displayName}
                </Link>
              </h5>
            </div>
          </div>
        </div>
        <div className="col-span-4 sm:col-span-8"></div>
      </div>
    </div>
  );
};

export default Navbar;
