import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useSignup = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const { setToken, setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const signup = async (username: string, email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/auth/signup`,
        {
          username,
          email,
          password,
        }
      );

      if (data.status === "success") {
        console.log(data);
        setToken(data.data.token);
        setUser(data.data.user);
        localStorage.setItem("chatToken", data.data.token);
        toast.success("The Account Created Successfully");
        navigate("/");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
};

export default useSignup;
