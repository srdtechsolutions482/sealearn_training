import fetch from "node-fetch";

export const handler = async (event) => {
  const response = await fetch("http://13.201.58.203:8443/register", {
    method: "POST",     });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };

};
