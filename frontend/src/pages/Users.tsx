import React, { useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import useSearchUsers from "../hooks/useSearchUsers";
import ConversationSkeleton from "../components/skeletons/ConversationSkeleton";
import useSelectConversation from "../hooks/useSelectConversation";
import { useNavigate } from "react-router-dom";

const Users: React.FC = () => {
  const [value, setValue] = useState<string>("");

  const { loading, users: searchResult } = useSearchUsers(value);
  const { handleSelect: handleSelectConversation } = useSelectConversation();

  const navigate = useNavigate();

  const handleSelect = async (seclectedUser: any, chat: any) => {
    await handleSelectConversation(seclectedUser, chat);
    navigate("/chats");
  };
  return (
    <div className=" min-h-screen shadow w-[300px]  max-md:w-full  dark:bg-zinc-700">
      <div className="px-6 pt-6">
        <h4 className="mb-0 text-gray-700 dark:text-gray-50 text-xl font-semibold">
          Users
        </h4>

        {/* <Search /> */}
        <>
          <div className=" flex items-center gap-3 py-3 mt-5 mb-5 rounded  bg-slate-100 dark:bg-zinc-600">
            <span className="text-lg text-gray-400 dark:text-gray-200  pe-1 ps-3 dark:bg-zinc-600">
              <RiSearchLine />
            </span>
            <input
              type="text"
              onChange={(e) => setValue(e.target.value.trim())}
              placeholder="Search users or email"
              className="border-0 bg-slate-100 w-full mr-4 text-gray-200  placeholder:text-[14px] focus:ring-offset-0 outline-none focus:ring-0 dark:bg-zinc-600  placeholder:text-gray-400 "
            />
          </div>
        </>
      </div>

      <div>
        {loading ? (
          [...Array(8)].map((_, idx) => <ConversationSkeleton key={idx} />)
        ) : searchResult.length > 0 ? (
          searchResult.map((u: any) => (
            <div
              key={u._id}
              onClick={() => handleSelect(u, null)}
              className="px-5 py-[15px] cursor-pointer transition-all ease-in-out border-b border-white/20 dark:border-zinc-700 dark:hover:bg-zinc-600 flex gap-2 items-center text-base font-semibold"
            >
              <div className="relative self-center ltr:mr-3 rtl:ml-3">
                <img
                  className="rounded-full w-9 h-9 object-cover"
                  src={u.profilePic}
                  alt={u.username}
                />
              </div>

              <div>
                <h5 className="mb-1 text-base truncate dark:text-gray-50">
                  {u.username}
                </h5>
              </div>
            </div>
          ))
        ) : (
          <h3 className="text-center mt-6 font-semibold text-lg text-gray-500">
            There are no users
          </h3>
        )}
      </div>
    </div>
  );
};

export default Users;
