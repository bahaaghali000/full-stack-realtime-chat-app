import { useState, FormEvent, ChangeEvent, useContext, useEffect } from "react";
import {
  RiEmotionHappyLine,
  RiAttachmentLine,
  RiSendPlane2Fill,
} from "react-icons/ri";
import { RootState } from "../../redux/Store";
import { useSelector } from "react-redux";
import { AuthContext } from "../../context/AuthContext";
import Loader from "../Loader";
import useSendMsg from "../../hooks/useSendMsg";
import { convertToBase64 } from "../../utils";
import toast from "react-hot-toast";

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [imageCaption, setImageCaption] = useState<string>("");
  const [image, setImage] = useState<File>();
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );

  const { user } = useContext(AuthContext);

  const { loading, sendMsg } = useSendMsg();

  const { selectedReceiver, selectedConversation, socket } = useSelector(
    (state: RootState) => state.user
  );

  const formatter: any = Intl.NumberFormat("en", {
    notation: "compact",
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);

      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (image) {
      const imageBase64: any = await convertToBase64(image);

      await sendMsg(
        imageBase64,
        selectedReceiver?._id,
        selectedConversation?._id,
        true,
        imageCaption
      );
      setImageCaption("");
      setImage(undefined);
      setSelectedImage(undefined);
    }
  };

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (message.length < 2 && !selectedImage) {
      toast.error("Message must be at least 2 characters");
    }

    await sendMsg(
      message,
      selectedReceiver?._id,
      selectedConversation?._id,
      false,
      undefined
    );

    setMessage("");
  };

  useEffect(() => {
    if (message.length > 0) {
      socket.emit("typing", {
        sender: user?._id,
        receiver: selectedReceiver?._id,
      });
    } else {
      socket.emit("typing stop", {
        sender: user?._id,
        receiver: selectedReceiver?._id,
      });
    }
  }, [message]);

  useEffect(() => {
    // Add event listener to handle clicks outside of edit menu
    document.addEventListener("click", handleClickOutside);

    return () => {
      // Remove event listener on component unmount
      document.removeEventListener("click", handleClickOutside);
    };
  }, [selectedImage]);

  const handleClickOutside = () => {
    if (selectedImage) {
      const confirm = window.confirm("Are you sure!");
      if (confirm) {
        setSelectedImage(undefined);
        setImage(undefined);
      }
    }
  };

  return (
    <div className="z-40 w-full p-6 max-md:pb-0 mb-0  bg-white border-t lg:mb-1 border-gray-50 dark:bg-zinc-800 dark:border-zinc-700">
      <form onSubmit={handleSend} className="flex gap-2 items-center">
        <div className="flex-grow">
          <input
            type="text"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            maxLength={150}
            className="
            w-full border-transparent rounded bg-gray-50 placeholder:text-base text-base dark:bg-zinc-700 dark:placeholder:text-gray-300 dark:text-gray-300 outline-none p-2"
            placeholder="Enter Message..."
          />
        </div>

        <div>
          <ul className="mb-0 flex items-center gap-5">
            <li className="inline-block" title="Emoji">
              <span className="border-transparent  relative dark:text-violet-200 text-base">
                <RiEmotionHappyLine />
              </span>
            </li>

            <li
              className="inline-block"
              onClick={(e) => e.stopPropagation()}
              title="Attached File"
            >
              <label
                htmlFor="file"
                className="border-transparent  relative dark:text-violet-200 text-base cursor-pointer"
              >
                <RiAttachmentLine />
              </label>
              <input
                type="file"
                id="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </li>

            <li className="inline-block" title="Attached File">
              <button
                type="submit"
                className="text-white border-transparent btn bg-violet-500 hover:bg-violet-600"
              >
                {selectedImage ? (
                  <RiSendPlane2Fill />
                ) : loading ? (
                  <Loader />
                ) : (
                  <RiSendPlane2Fill />
                )}
              </button>
            </li>

            {selectedImage && (
              <li
                onClick={(e) => e.stopPropagation()}
                className=" absolute bottom-24  right-8 w-[330px] max-md:w-1/2 max-sm:w-3/4 h-60  dark:bg-zinc-700 shadow-2xl rounded-lg overflow-hidden"
              >
                <div className=" w-full overflow-hidden relative flex flex-col items-center justify-between h-full gap-1 ">
                  <img
                    src={selectedImage}
                    className=" h-[70%] px-3 mt-2 mx-auto rounded-lg"
                    alt="Selected"
                  />
                  <p className=" absolute top-3 right-4 bg-slate-600 px-4 py-1 rounded-2xl text-base text-gray-100 font-semibold">
                    Size: {formatter.format(image?.size)}
                  </p>
                  <div className="flex justify-between w-full h-[50px] gap-2 p-2">
                    <input
                      type="text"
                      onChange={(e) => setImageCaption(e.target.value)}
                      placeholder="Write Caption"
                      className="
                        w-full border-transparent rounded  bg-gray-50 placeholder:text-base text-base dark:bg-zinc-800 dark:placeholder:text-gray-300 dark:text-gray-300 outline-none px-2"
                    />
                    <button
                      onClick={handleUpload}
                      className="text-white text-left flex items-center justify-center  p-3 py-2 rounded-lg border-transparent  bg-violet-500 hover:bg-violet-600"
                    >
                      {loading ? (
                        <Loader />
                      ) : (
                        <RiSendPlane2Fill className="p-0" />
                      )}
                    </button>
                  </div>
                </div>
              </li>
            )}
          </ul>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
