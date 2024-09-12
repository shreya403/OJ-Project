import { jwtDecode } from "jwt-decode";

const decode = (token) => {
    return jwtDecode(token);
};
export default decode;