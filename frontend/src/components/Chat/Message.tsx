import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import { RiMore2Line, RiDeleteBinLine, RiFileCopyLine } from "react-icons/ri";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import useDeleteMsg from "../../hooks/useDeleteMsg";
import { fileSaver, messageTime } from "../../utils";
import { IoMdDownload } from "react-icons/io";
import { updateLastMessage } from "../../redux/slices/userSlice";
import { TMessage } from "../../model";

interface Props {
  message: TMessage;
}

const Message: React.FC<Props> = ({ message }) => {
  const { selectedReceiver, selectedConversation } = useSelector(
    (state: RootState) => state.user
  );
  const [editMenu, setEditMenu] = useState<boolean>(false);
  const [showActionsIcon, setShowActionsIcon] = useState<boolean>(false);
  const { user } = useContext(AuthContext);

  const { loading, deleteMsg } = useDeleteMsg();

  const time = messageTime(message?.createdAt);

  const dispatch = useDispatch();

  const handleDelete = async (id: string) => {
    await deleteMsg(id);

    dispatch(updateLastMessage(selectedConversation?._id));

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

  useEffect(() => {
    // Add event listener to handle clicks outside of edit menu
    document.addEventListener("click", handleClickOutside);

    return () => {
      // Remove event listener on component unmount
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleClickOutside = () => {
    setEditMenu(false);
  };

  const handleClickOnEditMenuIcon = (
    event: React.MouseEvent<HTMLSpanElement>
  ) => {
    // Prevent event propagation to parent elements
    event.stopPropagation();

    // Toggle the edit menu
    setEditMenu(!editMenu);
  };

  const receiver = message.senderId === user?._id ? user : selectedReceiver;

  return (
    <>
      {loading && (
        <div className=" absolute z-50 top-0 left-0 min-h-screen w-full flex items-center justify-center bg-black bg-opacity-50">
          <span className="loading loading-ring loading-lg"></span>
        </div>
      )}

      <div
        onMouseEnter={() => setShowActionsIcon(true)}
        onMouseLeave={() => setShowActionsIcon(false)}
        className={`chat ${
          message.senderId === user?._id ? "chat-end" : "chat-start"
        } w-full `}
      >
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src={receiver?.profilePic} alt={receiver?.username} />
          </div>
        </div>
        <div className="chat-header">
          {message.senderId === user?._id ? "Me" : receiver?.username}{" "}
          <time className="text-xs opacity-50">{time}</time>
        </div>
        <div
          className={`chat-bubble ${
            message.senderId === user?._id
              ? "bg-gray-50 dark:bg-zinc-700 dark:text-gray-50"
              : "bg-violet-500 text-white"
          }   relative`}
        >
          {message.isImage ? (
            <div>
              <p>{message.caption}</p>
              <div className=" relative">
                <img
                  className=" h-32"
                  src={message.message}
                  alt={message.caption}
                />
                <span
                  className=" absolute top-2 right-1 text-xl shadow-2xl cursor-pointer"
                  onClick={() =>
                    fileSaver(
                      message.message,
                      `BGChat-${
                        message.caption ? message.caption : receiver.username
                      }-image.jpg`
                    )
                  }
                >
                  <IoMdDownload />
                </span>
              </div>
            </div>
          ) : (
            message.message
          )}{" "}
          {showActionsIcon && (
            <span
              onClick={handleClickOnEditMenuIcon}
              className={`absolute ${
                message.senderId === user?._id ? "-left-7" : "-right-7"
              } top-4 text-xl font-semibold  text-gray-50 cursor-pointer`}
            >
              <RiMore2Line />
            </span>
          )}
          {editMenu && (
            <div
              className={`absolute actions top-2 ${
                message.senderId === user?._id ? "-left-20 " : "left-0"
              }  z-50 w-40 py-2 my-6 text-left list-none bg-white border-none rounded shadow-lg dark:bg-zinc-700 dark:border-gray-600/50 block`}
            >
              <div
                onClick={() => handleCopy(message.message)}
                className="flex items-center justify-between cursor-pointer w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600"
              >
                <span>Copy</span>
                <RiFileCopyLine />
              </div>
              {message.isImage && (
                <div
                  onClick={() =>
                    fileSaver(
                      message.message,
                      `BGChat-${
                        message.caption ? message.caption : receiver.username
                      }-image.jpg`
                    )
                  }
                  className="flex items-center justify-between cursor-pointer w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600"
                >
                  <span>Download</span>
                  <IoMdDownload />
                </div>
              )}

              <div
                onClick={() => handleDelete(message._id)}
                className="flex items-center justify-between cursor-pointer w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600"
              >
                <span>Delete</span>
                <RiDeleteBinLine />
              </div>
            </div>
          )}
        </div>
        <div className="chat-footer opacity-50">
          {/* {message.seen ? "Seen" : "Delivered"} */}
        </div>
      </div>
    </>
  );
};

export default Message;
