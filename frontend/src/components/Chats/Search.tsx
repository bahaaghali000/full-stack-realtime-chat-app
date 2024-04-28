import React, { useEffect, useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import useSearchUsers from "../../hooks/useSearchUsers";
import { TConversation, TUser } from "../../model";

interface Props {
  handleSelect: (user: TUser, chat: TConversation | null) => void;
  value: string;
  setValue: (value: string) => void;
}

const Search: React.FC<Props> = ({ handleSelect, value, setValue }) => {
  const [users, setUsers] = useState<[]>([]);

  const { users: searchResult } = useSearchUsers(value);

  useEffect(() => {
    if (value.trim()) {
      setUsers(searchResult);
    } else {
      setUsers([]);
    }
  }, [searchResult]);

  return (
    <>
      <div className=" flex items-center gap-3 py-3 mt-5 mb-5 rounded  bg-slate-100 dark:bg-zinc-600">
        <span className="text-lg text-gray-400 dark:text-gray-200  pe-1 ps-3 dark:bg-zinc-600">
          <RiSearchLine />
        </span>
        <input
          type="text"
          onChange={(e) => setValue(e.target.value)}
          value={value}
          placeholder="Search users or email"
          className="border-0 bg-slate-100 w-full mr-4 text-gray-200  placeholder:text-[14px] focus:ring-offset-0 outline-none focus:ring-0 dark:bg-zinc-600  placeholder:text-gray-400 "
        />
      </div>
      <div>
        {users.map((user: any) => (
          <div
            key={user?._id}
            onClick={() => {
              handleSelect(user, null);
              setValue("");
              setUsers([]);
            }}
            className="px-5 py-[15px]  cursor-pointer transition-all ease-in-out border-b border-white/20 dark:border-zinc-700 dark:hover:bg-zinc-600 flex gap-2 items-center text-base font-semibold"
          >
            <div className="relative self-center ltr:mr-3 rtl:ml-3">
              <img
                className="rounded-full w-9 h-9 object-cover"
                src={user.profilePic ? user.profilePic : ""}
                alt={user.username}
              />
            </div>

            <div>
              <h5 className="mb-1 text-base truncate dark:text-gray-50">
                {user?.username}
              </h5>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Search;
