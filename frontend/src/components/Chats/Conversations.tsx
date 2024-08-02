import React from "react";
import { RootState } from "../../redux/Store";
import { useSelector } from "react-redux";
import Conversation from "./Conversation";
import { TConversation, TUser } from "../../model";

interface Props {
  handleSelect: (user: TUser, chat: TConversation) => void;
}

const Conversations: React.FC<Props> = ({ handleSelect }) => {
  const { chats } = useSelector((state: RootState) => state.user);

  return (
    <div>
      <h5 className="px-6 mb-1 text-lg font-semibold dark:text-gray-50">
        Recent
      </h5>
      {chats?.map((chat: any) => (
        <Conversation key={chat._id} chat={chat} handleSelect={handleSelect} />
      ))}
    </div>
  );
};

export default Conversations;
