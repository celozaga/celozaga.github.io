const crypto = require('crypto');

module.exports = (req, res) => {
    const { host } = req.headers;
    const client_id = process.env.OAUTH_CLIENT_ID;
    const redirect_uri = `https://${host}/api/callback`;
    const scope = 'repo,user';
    const state = crypto.randomBytes(16).toString('hex');

    const authorizationUri = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&state=${state}`;

    res.redirect(authorizationUri);
}; 
