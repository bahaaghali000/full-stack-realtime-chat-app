import Message from "./Message";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import { TMessage } from "../../model";
import { useEffect, useRef } from "react";

const Messages = () => {
  const { messages } = useSelector((state: RootState) => state.user);

  const lastMessageRef = useRef<any>();

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
      // lastMessageRef.current?.scrollIntoView();
    }, 0);
  }, [messages]);

  return (
    <div className="messages p-3 overflow-y-auto ">
      {messages?.map((m: TMessage) => (
        <div key={m._id} ref={lastMessageRef}>
          <Message message={m} />
        </div>
      ))}
    </div>
  );
};

export default Messages;
