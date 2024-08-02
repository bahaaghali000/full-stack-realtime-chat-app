import axios from "axios";
import  { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { useDispatch } from "react-redux";
import {
  removeChat,
  setSelectedConversation,
  setSelectedReceiver,
} from "../redux/slices/userSlice";

const useDeleteConversation = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useContext(AuthContext);

  const dispatch = useDispatch();

  const handleDelete = async (receiverId: string, conversationId: string) => {
    setLoading(true);
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/messages/delete/${receiverId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.status === "success") {
        toast.success(data.message);
        dispatch(removeChat(conversationId));
        dispatch(setSelectedConversation({}));
        dispatch(setSelectedReceiver({}));
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleDelete };
};

export default useDeleteConversation;
