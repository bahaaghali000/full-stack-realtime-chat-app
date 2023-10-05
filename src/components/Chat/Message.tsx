import { useState } from "react";
import { RiTimeLine } from "react-icons/ri";
import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import {
  RiMore2Line,
  RiDeleteBinLine,
  RiFileCopyLine,
  RiDownload2Line,
} from "react-icons/ri";
import { Timestamp, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import { MessageProps } from "../../model";
import toast from "react-hot-toast";

const Message: React.FC<MessageProps> = ({ message, messages }) => {
  const { userData, chatId } = useSelector((state: RootState) => state.user);
  const [editMenu, setEditMenu] = useState<boolean>(false);
  const user = useAuth();

  const minutes = new Timestamp(message.date.seconds, message.date.nanoseconds)
    .toDate()
    .getMinutes();

  const hours = new Timestamp(message.date.seconds, message.date.nanoseconds)
    .toDate()
    .getHours();

  const a = hours > 12 ? "PM" : "AM";

  const time = `${hours > 12 ? hours - 12 : hours}:${
    minutes < 10 ? "0" + minutes : minutes
  } ${a}`;

  const handleDelete = async (id: string) => {
    console.log(id);
    const newMegs = await messages.filter((msg) => msg.id !== id);

    updateDoc(doc(db, "chats", chatId), {
      messages: newMegs,
    });

    updateDoc(doc(db, "usersChats", chatId), {
      lastMsg: {
        text: newMegs[newMegs.length - 1].text,
      },
    });

    setEditMenu(false);
  };

  const handleCopy = (msg: string) => {
    navigator.clipboard.writeText(msg);
    toast.success("Message Copied", {
      icon: "👏",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
    setEditMenu(false);
  };

  return (
    <div
      className={`flex gap-5 items-end relative mb-5 ${
        message.senderId === user?.uid ? "owner" : "receiver"
      }`}
    >
      <div className="message-info">
        <img
          className=" w-10 h-10 rounded-full object-cover"
          src={
            message.senderId === user?.uid ? user?.photoURL : userData.photoURL
          }
          alt="message photo"
        />
      </div>

      <div
        className={`message-content relative  flex flex-col gap-3 px-5 py-3 text-white bg-violet-500 radious`}
      >
        <div className="">
          <p className="mb-2 font-semibold flex items-end justify-end">
            {message.text}
          </p>

          {message?.img && (
            <div className="relative flex items-end justify-end w-full">
              <div className="gradient">
                <img
                  className=" w-1/2 before:bg-gradient-to-t before:from-slate-800 to-transparent"
                  src={message?.img}
                  alt=""
                />
                <a
                  href={message?.img}
                  target="_blank"
                  className=" absolute top-0 right-1/2 mr-3 mt-1 z-10 text-xl cursor-pointer"
                >
                  <RiDownload2Line />
                </a>
              </div>
            </div>
          )}

          <p className="mt-1 mb-0 text-xs text-right text-white/50 flex items-center justify-end gap-1">
            <RiTimeLine />
            <span className=" align-middle">{time}</span>
          </p>
        </div>

        <span
          onClick={() => setEditMenu(!editMenu)}
          className={`absolute ${
            message.senderId === user?.uid ? "-left-8 " : " -right-8"
          } top-4 text-xl font-semibold  text-gray-50 cursor-pointer`}
        >
          <RiMore2Line />
        </span>

        {editMenu && (
          <div className="absolute actions -left-20 top-2  z-50 w-40 py-2 my-6 text-left list-none bg-white border-none rounded shadow-lg dark:bg-zinc-700 dark:border-gray-600/50 block">
            <div
              onClick={() => handleCopy(message.text)}
              className="flex items-center justify-between cursor-pointer w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600"
            >
              <span>Copy</span>
              <RiFileCopyLine />
            </div>

            <div
              onClick={() => handleDelete(message.id)}
              className="flex items-center justify-between cursor-pointer w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600"
            >
              <span>Delete</span>
              <RiDeleteBinLine />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
