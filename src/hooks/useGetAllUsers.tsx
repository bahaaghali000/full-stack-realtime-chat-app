import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase.config";

const useGetAllUsers = () => {
  const [allUsers, setAllUsers] = useState<[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const getUsers = async () => {
      const users: any = [];

      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setAllUsers(users);
      setLoading(false);
    };
    getUsers();
  }, []);
  return { allUsers, loading };
};

export default useGetAllUsers;
