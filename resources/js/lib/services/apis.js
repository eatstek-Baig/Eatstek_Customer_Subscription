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
        indexExpired: () => {
            return HttpService.get(`api/client/index-expired`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
        },
        indexBlocked: () => {
            return HttpService.get(`api/client/index-blocked`, {
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
        block: (values) => {
            return HttpService.patch(`api/client/block`,values, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
        },
        unblock: (values) => {
            return HttpService.patch(`api/client/unblock`,values, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
        },
    }
}

export default ApiService();