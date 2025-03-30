import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
// import Chatbot from "../chatbot/Chatbot";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {" "}
        <Outlet />
      </main>
      <Footer />
      {/* <Chatbot /> */}
    </div>
  );
};

export default Layout;
