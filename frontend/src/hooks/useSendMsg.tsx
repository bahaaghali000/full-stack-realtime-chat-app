import axios from "axios";
import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { addMessage } from "../redux/slices/userSlice";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const useSendMsg = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const { token } = useContext(AuthContext);

  const sendMsg = async (
    message: string,
    receiverId: string,
    conversationId: string,
    isImage: boolean,
    caption: string | undefined
  ) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/messages/send/${receiverId}`,
        {
          message,
          isImage,
          caption,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(
        addMessage({
          message: data.data.message,
          conversationId,
        })
      );

      toast.success("Message sent successfully", {
        icon: "👏",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return { loading, sendMsg };
};

export default useSendMsg;
