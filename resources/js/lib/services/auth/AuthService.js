import HttpService from "../api/HttpService";

export const AuthService = {

    login: (email, password) => {
         return HttpService.post('api/auth/login', {email, password});

    },
    user: () => {
         return HttpService.get('api/auth/user', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         })

    },
    logout: () => {
           return HttpService.post('api/auth/logout');
    },
    refreshToken: async () => {
        const { token } = await HttpService.post('api/auth/refresh');
        localStorage.setItem('token', token);
        return token;
    }
}

export default AuthService