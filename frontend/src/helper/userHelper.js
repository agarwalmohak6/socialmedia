import { jwtDecode } from "jwt-decode";

export const getDecodedval = () => {
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : {};

  return decoded;
};
