import { ChakraProvider } from "@chakra-ui/react";
import Router from "./routes";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { SocketProvider } from "./utils/SocketContext.js";
import useTheme from "./utils/systemTheme.js";
function App() {
  useTheme();
  return (
    <ChakraProvider>
      <SocketProvider>
        <ToastContainer position="top-center" autoClose={3000} />
        <Router />
      </SocketProvider>
    </ChakraProvider>
  );
}

export default App;
