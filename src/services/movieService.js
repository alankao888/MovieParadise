import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndPoint = apiUrl + "/movies";

export function getMovies() {
  return http.get(apiEndPoint);
}

export function getMovie(id) {
  return http.get(apiEndPoint + "/" + id);
}

export function saveMovie(movie) {
  if (!movie._id) {
    //movieInDb._id = Date.now().toString();
    return http.post(apiEndPoint, movie);
  } else {
    const body = { ...movie }; //不能直接改movie因為會把state改掉（改動state要用setState）
    delete body._id;
    return http.put(apiEndPoint + "/" + movie._id, body);
  }
}

export function deleteMovie(id) {
  return http.delete(apiEndPoint + "/" + id);
}
