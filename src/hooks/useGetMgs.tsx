import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase.config";
import useAuth from "./useAuth";
import { useSelector } from "react-redux";
import { RootState } from "../redux/Store";

const useGetMgs = () => {
  const { lastMsg, chatId } = useSelector((state: RootState) => state.user);

  const user = useAuth();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const chats: any = [];

    onSnapshot(collection(db, "usersChats"), (docs) => {
      docs.docs.forEach((dc) => {
        if (dc.id.includes(user?.uid)) {
          chats.push({
            ...dc.data().userInfo,
            ...dc.data().lastMsg,
            ...dc.data().date,
            sender: dc.data().senderDetails,
          });
        }

        chats.sort((a: any, b: any) => {
          const dateA = new Date(a.seconds);
          const dateB = new Date(b.seconds);
          return dateB.getTime() - dateA.getTime();
        });
        setChats(chats);
      });

      setLoading(false);
    });
  }, [lastMsg, user, chatId]);

  return { chats, loading };
};

export default useGetMgs;
