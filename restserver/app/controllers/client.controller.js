const db = require("../models");
const Client = db.clients;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  const client = {
    name: req.body.name,
    address: req.body.address,
    phone: req.body.phone,
  };

  Client.create(client)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Client.",
      });
    });
};
