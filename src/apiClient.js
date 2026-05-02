const axios = require("axios");

const BASE_URL = process.env.BASE_URL;

async function fetchFromApi(path, token) {
  const headers = {};

  if (token) {
    headers.Authorization = token;
  }

  const response = await axios.get(`${BASE_URL}${path}`, {
    headers
  });

  return response.data;
}

module.exports = { fetchFromApi };