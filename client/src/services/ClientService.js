import http from "../http-common";


const create = data => {
  return http.post("/clients", data);
};


const ClientService = { 
  create, 
};

export default ClientService;
