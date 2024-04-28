import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { removeMessage } from "../redux/slices/userSlice";

const useDeleteMsg = () => {
  const [loading, setLoading] = useState(false);

  const { token } = useContext(AuthContext);

  const dispatch = useDispatch();

  const deleteMsg = async (messageId: string) => {
    setLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/messages/${messageId}/delete`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(removeMessage(messageId));
    } catch (error: any) {
      console.log(error.response.data);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return { loading, deleteMsg };
};

export default useDeleteMsg;
