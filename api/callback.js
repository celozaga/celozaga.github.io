// No dependency required for Node 18+

module.exports = async (req, res) => {
    const { code } = req.query;
    const { host } = req.headers;

    if (!code) {
        return res.status(400).send('No code provided');
    }

    try {
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

        if (data.error) {
            return res.status(401).send(`OAuth Error: ${data.error}`);
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
