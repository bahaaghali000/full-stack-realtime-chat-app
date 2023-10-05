import Chat from "../components/Chat/Chat";
import SlideBar from "../components/SlideBar";
import Tab from "../components/Tab";

const Home = () => {
  return (
    <div className="home overflow-hidden">
      <div className="lg:flex md:flex-row  max-md:flex-col flex h-screen">
        <SlideBar />
        <Tab />
        <Chat />
      </div>
    </div>
  );
};

export default Home;
