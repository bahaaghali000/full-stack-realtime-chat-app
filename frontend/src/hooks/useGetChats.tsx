import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setChats } from "../redux/slices/userSlice";

const useGetChats = () => {
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useContext(AuthContext);

  const dispatch = useDispatch();

  useEffect(() => {
    const getChats = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/messages`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // setChats(data.data);
        dispatch(setChats(data.data));
      } catch (error: any) {
        console.log(error);
        toast.error(error.response.data.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (token) getChats();
  }, [token]);

  return { loading, error };
};

export default useGetChats;
