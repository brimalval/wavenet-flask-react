import axios, { AxiosResponse } from "axios";
import Song from "./types/Song";

// Send the request to the API which calls the model to generate melodies
export async function postParams(request: any) {
  console.log("Received by server: ", request);
  const response: AxiosResponse<Song[] | { message: string }> = await axios
    .post("/api/predict", request)
    .catch((error) => error.response);
  return response;
}

// Retrieve the file from the server
export async function getFile(path: string) {
  const response: AxiosResponse<Blob> = await axios
    .get(`/${path}`, {
      responseType: "blob",
    })
    .catch((error) => error.response);
  return response;
}