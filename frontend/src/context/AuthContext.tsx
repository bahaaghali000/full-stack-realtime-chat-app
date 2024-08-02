import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext<any>("");

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState(localStorage.getItem("chatToken") || "");
  const [user, setUser] = useState<any>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getMyProfile = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.status === "success") {
          setUser(data.data.user);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.log(error);
        setUser(null);
        setToken("");
        localStorage.removeItem("chatToken");
        navigate("/login");
      }
    };

    if (token) getMyProfile();
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
