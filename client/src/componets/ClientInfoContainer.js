import React from "react";
import ClientInfo from "./ClientInfo";
import useWebSocket from "react-use-websocket";
import isDocumentEvent from "../utils/Document";
import WS_URL from "../config/config";

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

export default ClientInfoContainer;