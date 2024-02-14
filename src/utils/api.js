import axios from "axios";
export let currentToken = null;

const headerForGetRequests = {
  "Content-type": "application/json",
};

const headerForUpdateAndCreateRequests = {
  "Content-Type": "multipart/form-data",
};

export const defaultApi = axios.create({
  baseURL: "",
  headers: headerForGetRequests,
});

export const formFileApi = axios.create({
  baseURL: "",
  headers: headerForUpdateAndCreateRequests,
});

export const mediaGatewayApi = axios.create({
  baseURL: "",
  headers: headerForGetRequests,
});