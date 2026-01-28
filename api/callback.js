// No dependency required for Node 18+

module.exports = async (req, res) => {
    const { code } = req.query;
    const { host } = req.headers;

    if (!code) {
        return res.status(400).send('No code provided');
    }

    try {
        // Verify environment variables are present (do not log secret)
        console.log('OAUTH_CLIENT_ID exists:', !!process.env.OAUTH_CLIENT_ID);
        console.log('OAUTH_CLIENT_SECRET exists:', !!process.env.OAUTH_CLIENT_SECRET);
        if (process.env.OAUTH_CLIENT_ID) {
            console.log('OAUTH_CLIENT_ID starts with:', process.env.OAUTH_CLIENT_ID.substring(0, 4));
        }

        const response = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                client_id: process.env.OAUTH_CLIENT_ID,
                client_secret: process.env.OAUTH_CLIENT_SECRET,
                code,
            }),
        });

        const data = await response.json();
        console.log('GitHub response status:', response.status);

        if (data.error) {
            console.error('GitHub OAuth Error:', data);
            return res.status(401).send(`OAuth Error: ${data.error} - ${data.error_description}`);
        }

        const token = data.access_token;
        const provider = 'github'; // Decap CMS expects this

        // Return HTML that posts the token back to the window opener (Decap CMS)
        const script = `
      <script>
        const receiveMessage = (message) => {
          window.opener.postMessage(
            'authorization:${provider}:success:${JSON.stringify({ token: '${token}', provider: '${provider}' })}',
            message.origin
          );
          window.removeEventListener("message", receiveMessage, false);
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:${provider}", "*");
      </script>
    `;

        res.setHeader('Content-Type', 'text/html');
        res.send(script);

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};
