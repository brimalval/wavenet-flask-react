import axios, { AxiosResponse } from "axios";
import Song from "./types/Song";

export async function postParams(request: any) {
  console.log("Received by server: ", request);
  const response: AxiosResponse<Song[] | { message: string }> = await axios
    .post("/api/predict", request)
    .catch((error) => error.response);
  return response;
}

export async function getFile(path: string) {
  const response: AxiosResponse<Blob> = await axios
    .get(`/${path}`, {
      responseType: "blob",
    })
    .catch((error) => error.response);
  return response;
}