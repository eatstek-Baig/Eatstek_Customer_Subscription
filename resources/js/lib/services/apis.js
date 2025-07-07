import HttpService from "./api/HttpService";

function ApiService() {
    return {
        create: (values) => {
            return HttpService.post(`api/client/register`, values, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
        },
        index: () => {
            return HttpService.get(`api/client/index`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
        },
        update: (values) => {
            return HttpService.patch(`api/client/update`,values, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
        },
    }
}

export default ApiService();