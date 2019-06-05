import React from 'react';
import openSocket from 'socket.io-client';
import './App.css';
import * as api from '../../api/api';

const SOCKET_URL = '/';

function App() {
  const [socket, setSocket] = React.useState();
  const [socketIsConnected, setSocketIsConnected] = React.useState(false);
  const [backendHasInternet, setBackendHasInternet] = React.useState(false);
  const [availableNetworks, setAvailableNetworks] = React.useState([]);
  const [inputSsid, setInputSsid] = React.useState('');
  const [inputPsk, setInputPsk] = React.useState('');
  const [feedback, setFeedback] = React.useState('');

  React.useEffect(() => {
    // initialize socket
    const connectedSocket = openSocket(SOCKET_URL);
    setSocket(connectedSocket);

    // set up listener for when socket connects
    connectedSocket.on('connect', () => {
      console.log('socket connected');
      setSocketIsConnected(true);
    });

    // set up listener for backend state
    connectedSocket.on('state', backendState => {
      setBackendHasInternet(backendState.wifi_connected);
    });

    api.getAvailableNetworks().then(response =>
      response.json().then(availableNetworks => {
        setAvailableNetworks(availableNetworks);
      })
    );

    // destroy the socket connection on unmount
    return () => {
      if (!socket) {
        return;
      }

      socket.off();
      socket.close();
    };
  }, []);

  const handleSsidChange = evt => {
    setInputSsid(evt.currentTarget.value);
  };

  const handlePskChange = evt => {
    setInputPsk(evt.currentTarget.value);
  };

  const handleConnect = evt => {
    evt.preventDefault();

    api
      .connectToWifi(inputSsid, inputPsk)
      .then(res => {
        setFeedback(`Connected to ${inputSsid}.`);
      })
      .catch(err => {
        console.log(err);
        setFeedback(
          `Unable to connect to ${inputSsid}. Please check the password and try again.`
        );
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Connected to backend? </p>
        <p>{socketIsConnected ? 'Yes!' : 'No'}</p>
        <div>
          <div>
            <p>Backend has internet?</p>
            <p>{backendHasInternet ? 'Yes!' : 'No'}</p>
          </div>
          <div>
            Connect the backend to a WiFi network:
            <form onSubmit={handleConnect} disabled={!inputSsid}>
              <select value={inputSsid || 'none'} onChange={handleSsidChange}>
                {!inputSsid && <option disabled value="none" />}
                {availableNetworks.map((network, i) => (
                  <option value={network} key={i}>
                    {network}
                  </option>
                ))}
              </select>
              <input
                type="password"
                value={inputPsk}
                onChange={handlePskChange}
              />
              <button disabled={!inputSsid}>Connect WiFi</button>
              <div>{feedback}</div>
            </form>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
