import { Toaster } from "react-hot-toast";
import "./App.css";
import Layout from "./layout/Layout";

function App() {
  return (
    <>
      <div>
        <Toaster position="top-center" reverseOrder={true} />
      </div>
      <Layout />
    </>
  );
}

export default App;
