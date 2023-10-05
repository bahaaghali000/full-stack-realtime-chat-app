import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import useAuth from "../../hooks/useAuth";

import { useDispatch } from "react-redux";
import { userChange } from "../../redux/slices/userSlice";

import { User } from "../../model";
import Search from "./Search";
import useGetMgs from "../../hooks/useGetMgs";

const Chats: React.FC = () => {
  const { chats, loading } = useGetMgs();

  const user = useAuth();

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

  return (
    <div className=" min-h-screen shadow  dark:bg-zinc-700">
      <div className="px-6 pt-6">
        <h4 className="mb-0 text-gray-700 dark:text-gray-50 text-xl font-semibold">
          Chats
        </h4>

        <Search />
      </div>

      <div className="">
        {loading ? (
          <h4 className="text-center mt-10 font-semibold text-2xl text-gray-500">
            Loading...
          </h4>
        ) : chats.length > 0 ? (
          <div>
            <h5 className="px-6 mb-1 text-lg font-semibold dark:text-gray-50">
              Recent
            </h5>
            {chats?.map((u: any, index: number) => (
              <div
                key={index}
                onClick={() => handleSelect(u.uid === user.uid ? u.sender : u)}
                className="px-5 py-[15px]  cursor-pointer transition-all ease-in-out border-b border-white/20 dark:border-zinc-700 dark:hover:bg-zinc-600 flex gap-2 items-center text-base font-semibold"
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
                    {u.uid === user.uid
                      ? u.sender?.displayName
                      : u?.displayName}
                  </h5>
                  <p className="mb-0 text-gray-500 truncate dark:text-gray-300 text-base font-normal">
                    {u.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <h3 className="text-center mt-10 font-semibold text-lg text-gray-500">
            There are no chats
          </h3>
        )}
      </div>
    </div>
  );
};

export default Chats;
