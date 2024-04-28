import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import { GoKebabHorizontal } from "react-icons/go";
import { RiArrowLeftSLine } from "react-icons/ri";
import { AuthContext } from "../../context/AuthContext";
import useDeleteConversation from "../../hooks/useDeleteConversation";
import {
  setSelectedConversation,
  setSelectedReceiver,
} from "../../redux/slices/userSlice";

const Navbar: React.FC = () => {
  const [show, setShow] = useState<boolean>(false);
  const { selectedReceiver, selectedConversation, onlineUsers } = useSelector(
    (state: RootState) => state.user
  );

  const dispatch = useDispatch();

  const { loading, handleDelete: deleteConversation } = useDeleteConversation();

  const { typingUser } = useSelector((state: RootState) => state.typing);

  const { user } = useContext(AuthContext);

  const isParticipantOnline = onlineUsers.some(
    (user: any) => user?.userId === selectedReceiver?._id
  );

  const isTyping = typingUser.includes(selectedReceiver?._id);

  const handleClick = () => {
    const conversation = document.getElementById("conversation");
    conversation?.classList.remove("max-md:z-[999]");

    dispatch(setSelectedConversation({}));
    dispatch(setSelectedReceiver({}));
  };

  const handleDelete = async () => {
    await deleteConversation(selectedReceiver?._id, selectedConversation?._id);
  };

  useEffect(() => {
    // Add event listener to handle clicks outside of edit menu
    document.addEventListener("click", handleClickOutside);

    return () => {
      // Remove event listener on component unmount
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleClickOutside = () => {
    setShow(false);
  };

  return (
    <div className="p-4 max-md:py-1 border-b border-gray-100 lg:p-6 dark:border-zinc-600">
      {loading && (
        <div className=" absolute z-50 top-0 left-0 min-h-screen w-full flex items-center justify-center bg-black bg-opacity-70">
          <span className="loading loading-ring loading-lg"></span>
        </div>
      )}
      <div className="flex relative items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div
              className="cursor-pointer max-md:block hidden"
              onClick={handleClick}
            >
              <span className="p-2 text-gray-500 text-base">
                <RiArrowLeftSLine />
              </span>
            </div>
            <div className="relative">
              <img
                className="rounded-full h-10 w-10 object-cover"
                src={
                  selectedReceiver.profilePic ? selectedReceiver.profilePic : ""
                }
                alt={selectedReceiver.username}
              />
              {isParticipantOnline && (
                <span className=" absolute top-0 right-0 block w-3 h-3 bg-green-500 rounded-full"></span>
              )}
            </div>
            <div>
              <h5 className="mb-0 truncate text-base font-semibold">
                <Link className="text-gray-800 dark:text-gray-50" to="/">
                  {selectedReceiver._id === user?._id
                    ? selectedReceiver.username
                    : selectedReceiver.username}
                </Link>
              </h5>
              {isTyping && (
                <p className="text-green-400 font-semibold">typing...</p>
              )}
            </div>
          </div>
        </div>
        <div
          className=" cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setShow(!show);
          }}
        >
          <GoKebabHorizontal />
        </div>
        {show && (
          <div className="absolute actions right-0 top-4  z-50 w-44 py-2 my-6 text-left list-none bg-white border-none rounded shadow-lg dark:bg-zinc-700 dark:border-gray-600/50 block">
            <div
              onClick={handleDelete}
              className="flex items-center justify-between cursor-pointer w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600"
            >
              <span>Delete The Conversation</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
