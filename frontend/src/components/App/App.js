import React from 'react';
import openSocket from 'socket.io-client';
import './App.css';

const API_URL = '/api';
const SOCKET_URL = '/';

function App() {
  const [socket, setSocket] = React.useState();
  const [isConnected, setIsConnected] = React.useState(false);

  React.useEffect(() => {
    // initialize socket
    const connectedSocket = openSocket(SOCKET_URL);
    setSocket(connectedSocket);

    // set up listener for when socket connects
    connectedSocket.on('connect', () => {
      console.log('socket connected');
      setIsConnected(true);
    });

    return () => {
      if (!socket) {
        return;
      }

      socket.off();
      socket.close();
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Connected to backend? </p>
        <p>{isConnected ? 'Yes!' : 'No'}</p>
      </header>
    </div>
  );
}

export default App;
