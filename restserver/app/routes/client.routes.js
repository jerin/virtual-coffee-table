module.exports = app => {
  const clients = require("../controllers/client.controller.js");

  var router = require("express").Router();

  router.post("/", clients.create);
 

  app.use("/api/clients", router);
};
