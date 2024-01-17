import React, { useEffect } from "react";
import { useState } from "react";
import ClientService from "../services/ClientService";

const ClientInfo = ({ handleHtmlChange, info, currentUser }) => {
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    var data = {
      name,
      address,
      phone,
    };

    ClientService.create(data)
      .then((response) => {
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    handleHtmlChange(name, address, phone, info?.editorContent?.shareScreen);
  }, [name, address, phone]);
  return (
    <form
      onSubmit={(e) => {
        handleSubmit(e);
      }}
      style={{
        display:
          currentUser === "Agent"
            ? "block"
            : info?.editorContent?.shareScreen
            ? "block"
            : "none",
      }}
    >
      <label>Name:</label>
      <br />
      <input
        name="name"
        type="text"
        value={info?.editorContent?.name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <br />
      <label>Addess:</label>
      <br />
      <input
        name="address"
        type="text"
        value={info?.editorContent?.address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <br />
      <br />
      <label>Phone:</label>
      <br />
      <input
        name="phone"
        type="text"
        value={info?.editorContent?.phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <br />
      <br />
      {currentUser === "Agent" && <input type="submit" value="Save" />}
    </form>
  );
};

export default ClientInfo;
