import { useSelector } from "react-redux";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import Navbar from "./Navbar";
import { RootState } from "../../redux/Store";
import logo from "../../assets/logo-dark-removebg-preview (1).png";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import useGetMessages from "../../hooks/useGetMessages";

const Chat: React.FC = () => {
  const { selectedReceiver } = useSelector((state: RootState) => state.user);

  const { loading } = useGetMessages();

  return (
    <div
      id="conversation"
      className={`chat-container overflow-hidden fixed top-0 right-0 ${
        selectedReceiver?._id ? " max-md:z-[999] max-md:w-full" : ""
      }  max-md:left-0 flex flex-col  max-md:absolute max-md:-z-10 w-full h-screen overflow-hidden transition-all duration-150 bg-white user-chat dark:bg-zinc-800`}
    >
      {selectedReceiver?._id ? (
        <>
          <Navbar />

          {loading ? (
            <div className="messages p-3 overflow-y-auto ">
              {[...Array(7)].map((_, idx) => (
                <MessageSkeleton key={idx} />
              ))}
            </div>
          ) : (
            <Messages />
          )}

          <ChatInput />
        </>
      ) : (
        <div className=" flex flex-col items-center justify-center h-full">
          <img className=" opacity-10" src={logo} alt="" />
          <h2 className=" text-2xl font-bold text-slate-400 opacity-40 mt-5">
            BGChat
          </h2>
        </div>
      )}
    </div>
  );
};

export default Chat;
