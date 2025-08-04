import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Header from "./components/Header";
import SignIn from "./pages/SignIn";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import Footer from "./pages/Footer";
import Browse from "./pages/Browse";
import Detail from "./pages/Detail";
import AddToDo from "./pages/AddToDo";
import ScrollToTop from "./components/ScrollToTop";
import AutoLogout from "./components/AutoLogout";

export default function App() {
  return (
    <div className="font-custom overflow-hidden">
      <BrowserRouter>
        <ScrollToTop />
        <Header />
        <ToastContainer />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route element={<AutoLogout />}>
            <Route path="/browse/:userId" element={<Browse />} />
            <Route path="/details/:todoId" element={<Detail />} />
            <Route path="/add-todo" element={<AddToDo />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}
