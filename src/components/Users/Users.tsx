import React, { useEffect, useState, ChangeEvent } from "react";
import { RiSearchLine } from "react-icons/ri";
import useGetAllUsers from "../../hooks/useGetAllUsers";
import { User } from "../../model";
import useAuth from "../../hooks/useAuth";
import { userChange } from "../../redux/slices/userSlice";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import { useDispatch } from "react-redux";

const Users: React.FC = () => {
  const [users, setUsers] = useState<[]>([]);

  const { allUsers, loading } = useGetAllUsers();
  const user = useAuth();

  useEffect(() => {
    setUsers(allUsers);
  }, [allUsers]);

  const dispatch = useDispatch();

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

        await setDoc(doc(db, "usersChats", combinedId), {
          userInfo: {
            uid: seclectedUser.uid,
            displayName: seclectedUser.displayName,
            photoURL: seclectedUser.photoURL,
          },
          date: serverTimestamp(),
        });
      }
      if (window.innerWidth < 786) {
        document.querySelector(".chat")?.classList.add("chat-show");
        document.querySelector(".slide-bar")?.classList.add("slide-hiden");
      }
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

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const result: any = allUsers.filter(
      (user: any) =>
        user.displayName.toLowerCase().includes(value.toLowerCase()) |
        user.email.includes(value.toLowerCase())
    );
    setUsers(result);
  };

  return (
    <div className="min-h-screen shadow  dark:bg-zinc-700">
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
              onChange={handleSearch}
              placeholder="Search users or email"
              className="border-0 bg-slate-100 w-full mr-4 text-gray-200  placeholder:text-[14px] focus:ring-offset-0 outline-none focus:ring-0 dark:bg-zinc-600  placeholder:text-gray-400 "
            />
          </div>
        </>
      </div>

      <div>
        {loading ? (
          <h4 className="text-center mt-10 font-semibold text-2xl text-gray-500">
            Loading...
          </h4>
        ) : (
          users.map((u: any) => (
            <div
              key={u.uid}
              onClick={() => handleSelect(u.uid === user.uid ? u.sender : u)}
              className="px-5 py-[15px] cursor-pointer transition-all ease-in-out border-b border-white/20 dark:border-zinc-700 dark:hover:bg-zinc-600 flex gap-2 items-center text-base font-semibold"
            >
              <div className="relative self-center ltr:mr-3 rtl:ml-3">
                <img
                  className="rounded-full w-9 h-9 object-cover"
                  src={u.uid === user.uid ? u.sender?.photoURL : u?.photoURL}
                  alt=""
                />
              </div>

              <div>
                <h5 className="mb-1 text-base truncate dark:text-gray-50">
                  {u.uid === user.uid ? u.sender?.displayName : u?.displayName}
                </h5>
                <p className="mb-0 text-gray-500 truncate dark:text-gray-300 text-base font-normal">
                  {u.text}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Users;
