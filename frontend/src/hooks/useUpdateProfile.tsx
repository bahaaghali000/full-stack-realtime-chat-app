import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const useUpdateProfile = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const { token, setUser } = useContext(AuthContext);

  const updateProfile = async (userInfo: any) => {
    setLoading(true);
    try {
      const { data } = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/auth/update`,
        userInfo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.status === "success") {
        console.log(data.data.user);
        setUser(data.data.user);
        toast.success("Your Profile has been updated successfully");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, updateProfile };
};

export default useUpdateProfile;
