import { useSelector } from "react-redux";
import Search from "../components/Chats/Search";
import useGetChats from "../hooks/useGetChats";
import { useState } from "react";
import { RootState } from "../redux/Store";
import Conversations from "../components/Chats/Conversations";
import ConversationSkeleton from "../components/skeletons/ConversationSkeleton";
import useSelectConversation from "../hooks/useSelectConversation";

const Chats: React.FC = () => {
  const { loading, error } = useGetChats();
  const { chats } = useSelector((state: RootState) => state.user);
  const [value, setValue] = useState<string>("");

  const { handleSelect: handleSelectConversation } = useSelectConversation();

  const handleSelect = async (seclectedUser: any, chat: any) => {
    await handleSelectConversation(seclectedUser, chat);
    setValue("");
  };

  return (
    <div className=" min-h-screen shadow w-[300px]  max-md:w-full  dark:bg-zinc-700">
      <div className="px-6 pt-6">
        <h4 className="mb-0 text-gray-700 dark:text-gray-50 text-xl font-semibold">
          Chats
        </h4>

        <Search handleSelect={handleSelect} value={value} setValue={setValue} />
      </div>

      <div>
        {loading ? (
          [...Array(5)].map((_, idx) => <ConversationSkeleton key={idx} />)
        ) : chats?.length > 0 ? (
          <Conversations handleSelect={handleSelect} />
        ) : (
          <h3 className="text-center mt-10 font-semibold text-lg text-gray-500">
            {error ? "Something went wrong" : "There are no chats"}
          </h3>
        )}
      </div>
    </div>
  );
};

export default Chats;
