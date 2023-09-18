import axios from "axios";
import { Auth } from "aws-amplify";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(function (config) {
    return new Promise((resolve, reject) => {
        Auth.currentSession()
            .then((session) => {
                var idTokenExpire = session.getIdToken().getExpiration();
                var refreshToken = session.getRefreshToken();
                var currentTimeSeconds = Math.round(+new Date() / 1000);
                // console.log(idTokenExpire, currentTimeSeconds);
                if (idTokenExpire < currentTimeSeconds) {
                    Auth.currentAuthenticatedUser().then((res) => {
                        res.refreshSession(refreshToken, (err, data) => {
                            if (err) {
                                Auth.signOut();
                            } else {
                                config.headers.Authorization =
                                    data.getIdToken().getJwtToken();
                                resolve(config);
                            }
                        });
                    });
                } else {
                    config.headers.Authorization =
                        session.getIdToken().getJwtToken();
                    resolve(config);
                }
            })
            .catch(() => {
                // No logged-in user: don't set auth header
                resolve(config);
            });
    });
});

export {
    axiosInstance
};
