import { useDispatch } from "react-redux";
import {
  setMessages,
  setSelectedConversation,
  setSelectedReceiver,
} from "../redux/slices/userSlice";

const useSelectConversation = () => {
  const dispatch = useDispatch();

  const handleSelect = async (seclectedUser: any, chat: any) => {
    dispatch(setSelectedReceiver(seclectedUser));
    dispatch(setMessages({ messages: [] }));
    dispatch(setSelectedConversation(chat));

    const conversation = document.getElementById("conversation");

    conversation?.classList.add("max-md:z-[999]");
  };
  return { handleSelect };
};

export default useSelectConversation;
