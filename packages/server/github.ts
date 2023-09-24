
// Exchange this code for an access token:

// POST https://github.com/login/oauth/access_token
// This endpoint takes the following input parameters.

// Parameter name	Type	Description
// client_id	string	Required. The client ID you received from GitHub for your OAuth app.
// client_secret	string	Required. The client secret you received from GitHub for your OAuth app.
// code	string	Required. The code you received as a response to Step 1.
// redirect_uri	string	The URL in your application where users are sent after authorization.
export async function getAccessToken(code: string) {
      const response = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                  'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                  client_id: process.env.GITHUB_CLIENT_ID,
                  client_secret: process.env.GITHUB_CLIENT_SECRET,
                  code,
                  redirect_uri: 'http://127.0.0.1:5173/'
            })
      })

      const data = await response.text();
      const decoded = decodeURIComponent(data);
      const params = new URLSearchParams(decoded);

      return {
            status: response.status,
            token: params.get('access_token'),
            scope: params.get('scope'),
            tokenType: params.get('token_type'),
            error: params.get('error'),
            errorDescription: params.get('error_description'),
            errorUri: params.get('error_uri'),
            state: params.get('state'),
      };
}