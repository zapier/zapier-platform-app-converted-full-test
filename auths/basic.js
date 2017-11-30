const basicAuth = {
  type: 'basic',
  test: {
    url: 'http://httpbin.org/basic-auth/user/passwd',
  },
  fields: [
    {
      key: 'username',
      label: 'Username',
      type: 'string',
      required: true,
    },
    {
      key: 'password',
      label: 'Password',
      type: 'password',
      required: true,
    },
  ],
  connectionLabel: '{{bundle.authData.username}}',
};

module.exports = basicAuth;
