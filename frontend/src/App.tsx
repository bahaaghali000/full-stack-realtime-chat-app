import toast, { Toaster } from "react-hot-toast";
import Routing from "./Routes/Router";
import SideBar from "./components/SideBar/SideBar";
import { useLocation } from "react-router-dom";
import Chat from "./components/Chat/Chat";
import { useContext, useEffect } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import {
  addChat,
  addMessage,
  seenMessages,
  setOnlineUsers,
  setSocket,
  updateUnseenMessages,
} from "./redux/slices/userSlice";
import { AuthContext } from "./context/AuthContext";
import {
  addTypingChat,
  addTypingUser,
  removeTypingChat,
  removeTypingUser,
} from "./redux/slices/typingSlice";
import { TUser } from "./model";

const App: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fn = async () => {
      const socket = io(import.meta.env.VITE_BASE_URL);

      socket.on("connect", () => {
        socket.emit("addUser", user?._id);

        socket.on("getUsers", (data: TUser[]) => {
          dispatch(setOnlineUsers(data));
        });

        socket.on("newMessage", (data: any) => {
          toast.success("You have a new message", {
            icon: "👏",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          dispatch(
            addMessage({
              message: data.message,
              conversationId: data.conversationId,
            })
          );
          dispatch(
            updateUnseenMessages({
              id: data.conversationId,
              unseenMessages: data.unseenMessages,
            })
          );
        });

        socket.on("typing", (data) => {
          dispatch(addTypingChat(data.conversation));
          dispatch(addTypingUser(data.sender));
        });

        socket.on("typing stop", (data) => {
          dispatch(removeTypingChat(data.conversation));
          dispatch(removeTypingUser(data.sender));
        });

        socket.on("newChat", (data: any) => {
          dispatch(addChat(data));
        });

        socket.on("seenMessages", (conversationId: string) => {
          console.log("listen");
          dispatch(seenMessages(conversationId));
        });
      });

      dispatch(setSocket(socket));
    };
    if (user?._id) fn();
  }, [user?._id]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={true} />

      {!location.pathname.includes("login") &&
        !location.pathname.includes("signup") && <SideBar />}
      <main className="md:pl-[75px] z-20 w[500px] overflow-hidden  max-md:w-full max-md:pt-[70px]  min-h-screen shadow bg-violet-50  dark:bg-zinc-900">
        <Routing />
      </main>
      <Chat />
    </>
  );
};

export default App;
