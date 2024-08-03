import {
  RiUser2Line,
  RiContactsLine,
  RiSettings2Line,
  RiInformationLine,
} from "react-icons/ri";
import { NavLink } from "react-router-dom";

const nav_links = [
  {
    id: 1,
    name: "Profile",
    path: "/profile",
    icon: <RiUser2Line fontSize={"1.5rem"} />,
  },
  {
    id: 2,
    name: "Chats",
    path: "/chats",
    icon: <RiContactsLine fontSize={"1.5rem"} />,
  },
  {
    id: 3,
    name: "Users",
    path: "/users",
    icon: <RiContactsLine fontSize={"1.5rem"} />,
  },
  {
    id: 4,
    name: "About",
    path: "/about",
    icon: <RiInformationLine fontSize={"1.5rem"} />,
  },
  {
    id: 5,
    name: "Settings",
    path: "/settings",
    icon: <RiSettings2Line fontSize={"1.5rem"} />,
  },
];

const SideBarLinks = () => {
  return (
    <ul className="links max-md:flex max-md:w-full md:block">
      {nav_links.map((link) => (
        <li
          key={link.id}
          className={` tab-button flex relative cursor-pointer items-center justify-center hover:bg-gray-200 mx-auto h-14 w-14 leading-[14px] group/tab my-2 rounded-lg dark:text-slate-300 dark:hover:bg-slate-700`}
        >
          <NavLink
            to={link.path}
            className={({ isActive }) =>
              isActive
                ? "active_link w-full h-full rounded-lg flex items-center justify-center"
                : "w-full h-full flex items-center justify-center"
            }
          >
            {link.icon}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default SideBarLinks;
