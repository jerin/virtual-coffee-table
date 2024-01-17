import React, { useEffect, useState } from "react";
import { Navbar, NavbarBrand } from "reactstrap";
import useWebSocket, { ReadyState } from "react-use-websocket";
import ClientInfo from "./ClientInfo";
import WS_URL from "../config/config";
import copyUrl from "../utils/CopyUrl";
import Users from "./Users";
import LoginSection from "./LoginSection";

import "./App.css";

function isDocumentEvent(message) {
  let evt = JSON.parse(message.data);
  return evt.type === "contentchange";
}

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
          <EditorSection currentUser={username} />
        ) : (
          <LoginSection onLogin={setUsername} />
        )}
      </div>
    </>
  );
}

function EditorSection({ currentUser }) {
  const [shareScreen, setShareScreen] = useState(0);
  const { lastJsonMessage, sendJsonMessage } = useWebSocket(WS_URL, {
    share: true,
    filter: isDocumentEvent,
  });

  const updateShareScreenInfo = (value) => {
    setShareScreen(value);
    sendJsonMessage({
      type: "contentchange",
      content: { shareScreen: value },
    });
  };

  return (
    <div className="main-content">
      <div className="document-holder">
        {currentUser === "Agent" && (
          <button
            type="button"
            onClick={() => updateShareScreenInfo(shareScreen === 0 ? 1 : 0)}
          >
            {shareScreen === 0 ? "Share Screen" : "Stop Sharing"}
          </button>
        )}
        <div className="currentusers">
          <Users />
        </div>
        <ClientInfoContainer
          shareScreen={shareScreen}
          currentUser={currentUser}
        />
      </div>
      {currentUser === "Agent" && (
        <button
          onClick={copyUrl}
          style={{ width: "100px", height: "50px", padding: "5px" }}
        >
          Copy Url
        </button>
      )}
    </div>
  );
}

const ClientInfoContainer = ({ shareScreen, currentUser }) => {
  const { lastJsonMessage, sendJsonMessage } = useWebSocket(WS_URL, {
    share: true,
    filter: isDocumentEvent,
  });

  let html = lastJsonMessage?.data || "";

  const handleHtmlChange = (name, address, phone, shareScreen) => {
    sendJsonMessage({
      type: "contentchange",
      content: { name, address, phone, shareScreen },
    });
  };

  return (
    <ClientInfo
      handleHtmlChange={handleHtmlChange}
      info={html}
      currentUser={currentUser}
    />
  );
};

export default App;
