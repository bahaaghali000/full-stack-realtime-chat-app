import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const useSearchUsers = (value: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<any>([]);

  const { token } = useContext(AuthContext);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/auth/?search=${value}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(data.data.users);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    let timeout: any;
    timeout = setTimeout(() => {
      fetchUsers();
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [value]);

  return { loading, users };
};

export default useSearchUsers;
