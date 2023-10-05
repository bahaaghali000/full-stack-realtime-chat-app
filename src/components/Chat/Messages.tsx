import Message from "./Message";
import { useEffect, useState } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../firebase.config";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import { MessageData } from "../../model";

const Messages = () => {
  const [messages, setMessages] = useState<MessageData[]>();

  const { chatId, userData } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const unSub =
      chatId &&
      onSnapshot(doc(db, "chats", chatId), (doc) => {
        doc.exists() && setMessages(doc.data().messages);
      });

    return () => {
      if (unSub) {
        unSub();
      }
    };
  }, [chatId]);
  console.log(userData);

  return (
    <div className="messages p-3 overflow-y-auto ">
      {messages?.map((m) => (
        <Message message={m} messages={messages} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;
