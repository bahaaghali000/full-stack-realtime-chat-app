const ConversationSkeleton = () => {
  return (
    <div className="flex gap-4 items-center px-5 py-[15px]">
      <div className="skeleton bg-gray-200 dark:bg-gray-800 w-10 h-10 rounded-full shrink-0"></div>
      <div className="flex flex-col gap-4">
        <div className="skeleton bg-gray-200 dark:bg-gray-800  h-3 w-20"></div>
        <div className="skeleton bg-gray-200 dark:bg-gray-800  h-3 w-28"></div>
      </div>
    </div>
  );
};

export default ConversationSkeleton;
