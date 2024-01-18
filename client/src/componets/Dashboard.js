import React, {  useState } from "react";
import useWebSocket from "react-use-websocket";
import WS_URL from "../config/config";
import ClientInfoContainer from "./ClientInfoContainer";
import copyUrl from "../utils/CopyUrl";
import Users from "./Users";
import isDocumentEvent from "../utils/Document";

const Dashborad = ({ currentUser }) => {
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

export default Dashborad;