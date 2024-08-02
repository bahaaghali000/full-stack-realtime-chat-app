import axios from "axios";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const { setToken, setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/auth/login`,
        {
          email,
          password,
        }
      );

      if (data.status === "success") {
        setToken(data.data.token);
        setUser(data.data.user);
        localStorage.setItem("chatToken", data.data.token);
        toast.success("Login successful");
        navigate("/");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};

export default useLogin;
