import React, { useEffect, useState } from "react";
import { Navbar, NavbarBrand, UncontrolledTooltip } from "reactstrap";
import useWebSocket, { ReadyState } from "react-use-websocket";
import ClientInfo from "./ClientInfo";
import Avatar from "react-avatar";

import "./App.css";

const WS_URL = "ws://127.0.0.1:8000";

function isUserEvent(message) {
  let evt = JSON.parse(message.data);
  return evt.type === "userevent";
}

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

function LoginSection({ onLogin }) {
  const [username, setUsername] = useState("");
  useWebSocket(WS_URL, {
    share: true,
    filter: () => false,
  });
  function logInUser() {
    if (!username.trim()) {
      return;
    }
    onLogin && onLogin(username);
  }

  return (
    <div className="account">
      <div className="account__wrapper">
        <div className="account__card">
          <div className="account__profile">
            <p className="account__name">Hello, user!</p>
            <p className="account__sub">Join to virtual coffee table</p>
          </div>
          <input
            name="username"
            onInput={(e) => setUsername(e.target.value)}
            className="form-control"
          />
          <button
            type="button"
            onClick={() => logInUser()}
            className="btn btn-primary account__btn"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}

function History() {
  console.log("history");
  const { lastJsonMessage } = useWebSocket(WS_URL, {
    share: true,
    filter: isUserEvent,
  });
  const activities = lastJsonMessage?.data.userActivity || [];
  return (
    <ul>
      {activities.map((activity, index) => (
        <li key={`activity-${index}`}>{activity}</li>
      ))}
    </ul>
  );
}

function Users() {
  const { lastJsonMessage } = useWebSocket(WS_URL, {
    share: true,
    filter: isUserEvent,
  });
  const users = Object.values(lastJsonMessage?.data.users || {});
  return users.map((user) => (
    <div key={user.username}>
      <span id={user.username} className="userInfo" key={user.username}>
        <Avatar name={user.username} size={40} round="20px" />
      </span>
      <UncontrolledTooltip placement="top" target={user.username}>
        {user.username}
      </UncontrolledTooltip>
    </div>
  ));
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

  const copy = () => {
    navigator.clipboard.writeText("http://localhost:3000/");
    alert("Copied to clipboard.");
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
        <Document shareScreen={shareScreen} currentUser={currentUser} />
      </div>
      {/* <div className="history-holder">
        <History />
      </div> */}
      {currentUser === "Agent" && <button
        onClick={copy}
        style={{width:"100px", height:"50px", padding:"5px"}}
        
      >
       
        Copy Url
      </button>}
    </div>
  );
}

function Document({ shareScreen, currentUser }) {
  const { lastJsonMessage, sendJsonMessage } = useWebSocket(WS_URL, {
    share: true,
    filter: isDocumentEvent,
  });

  let html = lastJsonMessage?.data || "";

  function handleHtmlChange(name, address, phone, shareScreen) {
    console.log("html change", shareScreen);
    sendJsonMessage({
      type: "contentchange",
      content: { name, address, phone, shareScreen },
    });
  }

  return (
    <ClientInfo
      handleHtmlChange={handleHtmlChange}
      info={html}
      currentUser={currentUser}
    />
  );
}

export default App;
