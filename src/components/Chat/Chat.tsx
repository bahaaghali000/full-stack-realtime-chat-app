import { useSelector } from "react-redux";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import Navbar from "./Navbar";
import { RootState } from "../../redux/Store";
import logo from "../../assets/logo-dark-removebg-preview (1).png";

const Chat: React.FC = () => {
  const { chatId } = useSelector((state: RootState) => state.user);

  return (
    <div className="chat max-md:absolute max-md:-z-10 w-full h-screen overflow-hidden transition-all duration-150 bg-white user-chat dark:bg-zinc-800">
      {chatId ? (
        <>
          <Navbar />

          <Messages />

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
