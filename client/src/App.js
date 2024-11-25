import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage, SignupPage, ActivationPage } from "./Routes";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/sign-up" element={<SignupPage />}></Route>
        <Route
          path="/activation/:activation_token"
          element={<ActivationPage />}
        ></Route>
        
      </Routes>

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
}

export default App;
