import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { RootState } from "../../redux/Store";
import { useSelector } from "react-redux";
import { TConversation, TUser } from "../../model";

interface Props {
  chat: any;
  handleSelect: (user: TUser, chat: TConversation) => void;
}

const Conversation: React.FC<Props> = ({ chat, handleSelect }) => {
  const { user } = useContext(AuthContext);

  const { onlineUsers, selectedConversation } = useSelector(
    (state: RootState) => state.user
  );
  const { typingChat } = useSelector((state: RootState) => state.typing);

  // Determine if the participant is online
  const [isParticipantOnline] = chat?.participants?.filter(
    (participant: any) => {
      const isNotMe = participant._id !== user?._id;
      const isOnline = onlineUsers.some(
        (onlineUser: any) => onlineUser.userId === participant._id
      );

      return isNotMe && isOnline;
    }
  );

  const isTyping = typingChat.includes(chat?._id);

  const isActive = chat._id === selectedConversation?._id;

  return (
    <div
      key={chat._id}
      onClick={() =>
        handleSelect(
          chat.participants[1]._id === user._id
            ? chat.participants[0]
            : chat.participants[1],
          chat
        )
      }
      className={`px-5 py-[15px] ${
        isActive ? "bg-gray-200 dark:bg-zinc-600" : ""
      }  cursor-pointer transition-all ease-in-out border-b border-white/20 hover:bg-gray-200 dark:border-zinc-700 dark:hover:bg-zinc-600 flex gap-2 items-center text-base font-semibold `}
    >
      <div className="relative self-center ltr:mr-3 rtl:ml-3">
        <img
          className="rounded-full w-9 h-9 object-cover"
          src={
            chat?.participants[1]?._id === user?._id
              ? chat.participants[0]?.profilePic
              : chat.participants[1]?.profilePic
          }
          alt={
            chat.participants[1]?._id === user?._id
              ? chat.participants[0].username
              : chat.participants[1]?.username
          }
        />
        {isParticipantOnline && (
          <span className=" absolute top-0 right-0 block w-3 h-3 bg-green-500 rounded-full"></span>
        )}
      </div>

      <div className=" w-[40%]">
        <h5 className="mb-1 text-base truncate w-full dark:text-gray-50">
          {chat.participants[1]?._id === user?._id
            ? chat.participants[0].username
            : chat.participants[1]?.username}
        </h5>
        {isTyping ? (
          <h2 className="text-green-400">Typing...</h2>
        ) : (
          <p className="mb-0 text-gray-500 truncate w-full dark:text-gray-300 text-base font-normal">
            {chat?.lastMsg ? chat.lastMsg : ""}
          </p>
        )}
      </div>
    </div>
  );
};

export default Conversation;
