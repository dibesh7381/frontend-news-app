import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ReporterPage from "./components/ReporterPage";
import NewsFeed from "./components/NewsFeed";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar";

function App() {
  return (

      <>
         <Navbar/>
         <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/news" element={<NewsFeed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reporter" element={<ReporterPage />} />
        <Route path="/profile" element={<Profile/>} />
      </Routes>
      </>

  );
}

export default App;


