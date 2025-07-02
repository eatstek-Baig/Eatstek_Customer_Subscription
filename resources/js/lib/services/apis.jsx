import HttpService from "./api/HttpService";

function ApiService() {
    return {
        adminLogin: (email, password) => {
            return HttpService.post(`api/auth/login`, { email, password });
        },
    }
}

export default ApiService();