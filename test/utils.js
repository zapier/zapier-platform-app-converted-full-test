const utils = {
  getAuthData: () => {
    const now = new Date();

    if (process.env.AUTH_TYPE) {
      if (process.env.AUTH_TYPE === 'api-header' || process.env.AUTH_TYPE === 'api-query') {
        return {
          apiKey: process.env.API_KEY,
        };
      } else if (process.env.AUTH_TYPE === 'session') {
        return {
          sessionKey: `${now.getFullYear()}-${now.getMonth() + 1}`,
        };
      } else if (process.env.AUTH_TYPE === 'oauth2') {
        return {
          access_token: process.env.ACCESS_TOKEN,
          refresh_token: process.env.REFRESH_TOKEN,
        };
      }
    }

    return {
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
    };
  },
};

module.exports = utils;
