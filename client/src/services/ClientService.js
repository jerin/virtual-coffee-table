import http from "../api/HttpCommon";


const create = data => {
  return http.post("/clients", data);
};


const ClientService = { 
  create, 
};

export default ClientService;
