import Chats from "./Chats/Chats";
import Profile from "./Profile/Profile";
import Users from "./Users/Users";
import Settings from "./settings/Settings";
import AboutUs from "./About/AboutUs";

const Tab: React.FC = () => {
  // max-md:h-screen
  return (
    <div className=" w-[500px] bg-slate-50 max-md:h-full overflow-y-auto max-md:w-full shadow lg:mb-0 dark:bg-zinc-700 ">
      <div
        className="tab-content min-h-full overflow-y-auto overflow-x-hidden tab-active"
        id="chats-content"
      >
        <Chats />
      </div>

      <div className="tab-content h-full" id="profile">
        <Profile />
      </div>

      <div className="tab-content h-full" id="users">
        <Users />
      </div>

      <div className="tab-content h-full" id="about">
        <AboutUs />
      </div>

      <div className="tab-content h-full" id="settings">
        <Settings />
      </div>
    </div>
  );
};

export default Tab;
