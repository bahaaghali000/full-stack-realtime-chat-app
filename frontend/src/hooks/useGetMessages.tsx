import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/Store";
import {
  addChat,
  setMessages,
  setSelectedConversation,
  setSelectedReceiver,
} from "../redux/slices/userSlice";
import toast from "react-hot-toast";

const useGetMessages = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const { token } = useContext(AuthContext);

  const { selectedReceiver } = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/messages/${
            selectedReceiver._id
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.isNewConversation) {
          dispatch(setSelectedConversation(data.chat));
          dispatch(addChat(data.chat));
        } else {
          dispatch(setMessages({ messages: data.data, conversationId: null }));
        }
      } catch (error: any) {
        dispatch(setSelectedReceiver({}));
        dispatch(setMessages({}));
        console.log(error);
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    if (selectedReceiver?._id) fetchMessages();
  }, [selectedReceiver]);

  return { loading };
};

export default useGetMessages;
