import { createContext, useState, useEffect } from 'react';
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(`${process.env.REACT_APP_BACKEND_WS_URL}`); 
    setSocket(newSocket);

    // Cleanup function to disconnect on unmount
    return () => newSocket.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
