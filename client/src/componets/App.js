import React, { useEffect, useState } from "react";
import { Navbar, NavbarBrand } from "reactstrap";
import useWebSocket, { ReadyState } from "react-use-websocket";
import WS_URL from "../config/config";
import Dashborad from "./Dashboard";
import LoginSection from "./LoginSection";

import "./App.css";



function App() {
  const [username, setUsername] = useState("");
  const { sendJsonMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log("WebSocket connection established.");
    },
    share: true,
    filter: () => false,
    retryOnError: true,
    shouldReconnect: () => true,
  });

  useEffect(() => {
    if (username && readyState === ReadyState.OPEN) {
      sendJsonMessage({
        username,
        type: "userevent",
      });
    }
  }, [username, sendJsonMessage, readyState]);

  return (
    <>
      <Navbar color="light" light>
        <NavbarBrand href="/">Virtul coffee table</NavbarBrand>
      </Navbar>
      <div className="container-fluid">
        {username ? (
          <Dashborad currentUser={username} />
        ) : (
          <LoginSection onLogin={setUsername} />
        )}
      </div>
    </>
  );
}


export default App;
