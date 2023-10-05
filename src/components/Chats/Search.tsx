import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import { db } from "../../firebase.config";
import useAuth from "../../hooks/useAuth";
import { User } from "firebase/auth";
import { userChange } from "../../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import useGetAllUsers from "../../hooks/useGetAllUsers";

const Search: React.FC = () => {
  const [value, setValue] = useState<string>("");
  const [users, setUsers] = useState<[]>([]);

  const { allUsers } = useGetAllUsers();

  const user = useAuth();

  const dispatch = useDispatch();

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value.trim());
    try {
      const searchResult: any = allUsers.filter(
        (doc: any) =>
          doc.displayName
            .toLowerCase()
            .includes(e.target.value.trim().toLowerCase()) |
          doc.email.includes(e.target.value.trim().toLowerCase())
      );

      setUsers(searchResult);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelect = async (seclectedUser: User) => {
    const combinedId =
      user.uid > seclectedUser.uid
        ? user.uid + seclectedUser.uid
        : seclectedUser.uid + user.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), {
          messages: [],
        });

        console.log(combinedId);

        await setDoc(doc(db, "usersChats", combinedId), {
          userInfo: {
            uid: seclectedUser.uid,
            displayName: seclectedUser.displayName,
            photoURL: seclectedUser.photoURL,
          },
          senderDetails: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          date: serverTimestamp(),
        });
      }
      if (window.innerWidth < 786) {
        document.querySelector(".chat")?.classList.add("chat-show");
        document.querySelector(".slide-bar")?.classList.add("slide-hiden");
      }
      setUsers([]);
      setValue("");
    } catch (error) {
      console.log(error);
    }

    dispatch(
      userChange({
        combinedId,
        uid: seclectedUser.uid,
        displayName: seclectedUser.displayName,
        photoURL: seclectedUser.photoURL,
      })
    );
  };

  return (
    <>
      <div className=" flex items-center gap-3 py-3 mt-5 mb-5 rounded  bg-slate-100 dark:bg-zinc-600">
        <span className="text-lg text-gray-400 dark:text-gray-200  pe-1 ps-3 dark:bg-zinc-600">
          <RiSearchLine />
        </span>
        <input
          type="text"
          onChange={handleSearch}
          value={value}
          placeholder="Search users or email"
          className="border-0 bg-slate-100 w-full mr-4 text-gray-200  placeholder:text-[14px] focus:ring-offset-0 outline-none focus:ring-0 dark:bg-zinc-600  placeholder:text-gray-400 "
        />
      </div>
      <div>
        {users.map((user: User) => (
          <div
            key={user?.uid}
            onClick={() => handleSelect(user)}
            className="px-5 py-[15px]  cursor-pointer transition-all ease-in-out border-b border-white/20 dark:border-zinc-700 dark:hover:bg-zinc-600 flex gap-2 items-center text-base font-semibold"
          >
            <div className="relative self-center ltr:mr-3 rtl:ml-3">
              <img
                className="rounded-full w-9 h-9 object-cover"
                src={user.photoURL ? user.photoURL : ""}
                alt=""
              />
            </div>

            <div>
              <h5 className="mb-1 text-base truncate dark:text-gray-50">
                {user?.displayName}
              </h5>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Search;
