import { useEffect, useState } from 'react'

/**
 *
 * @param login Suggests a specific account to use for signing in and authorizing the app.
 */
function authorize(login?: string) {
    // 	Required. The client ID you received from GitHub when you registered.
    const client_id: string = import.meta.env.GITHUB_CLIENT_ID;
    // 	The URL in your application where users will be sent after authorization. See details below about redirect urls.
    const redirect_uri: string = 'http://127.0.0.1:5173/';
    // 	A space-delimited list of scopes. If not provided, scope defaults to an empty list for users that have not authorized any scopes for the application. For users who have authorized scopes for the application, the user won't be shown the OAuth authorization page with the list of scopes. Instead, this step of the flow will automatically complete with the set of scopes the user has authorized for the application. For example, if a user has already performed the web flow twice and has authorized one token with user scope and another token with repo scope, a third web flow that does not provide a scope will receive a token with user and repo scope.
    const scope: string = 'public_repo';
    // 	An unguessable random string. It is used to protect against cross-site request forgery attacks.
    const state: string = 'dingodong123';
    // 	Whether or not unauthenticated users will be offered an option to sign up for GitHub during the OAuth flow. The default is true. Use false when a policy prohibits signups.
    const allow_signup: string = 'true';

    let url = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&state=${state}&allow_signup=${allow_signup}`;

    if (login) {
        url += `&login=${login}`
    }

    window.location.href = url
}

export async function getAccessToken(code: string) {
    const response = await fetch('http://localhost:3000?code=' + code)
    const json = await response.json()
    console.log(json)
    return json.token
}

export default function useAuthorize() {
    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('token'))
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [codeAndState, setCodeAndState] = useState<{
        code: string | null,
        state: string | null,
    }>({
        code: localStorage.getItem('code'),
        state: localStorage.getItem('state'),
    });

    function clearStoreCodeAndState() {
        localStorage.removeItem('code')
        localStorage.removeItem('state')
        localStorage.removeItem('token')
        setAccessToken(null)
        setCodeAndState({
            code: null,
            state: null,
        })
    }

    async function getAndSetAccessToken(c: string) {
        setLoading(true)
        try {
            const token = await getAccessToken(c)
            if (token) {
                console.log('token', token);
                localStorage.setItem('token', token)
                setAccessToken(token)
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message || 'Unknown error')
            } else {
                console.error(error)
            }
        }
        setLoading(false)
    }

    useEffect(() => {
        let code = new URLSearchParams(window.location.search).get('code')
        let state = new URLSearchParams(window.location.search).get('state')

        if (code && state) {
            localStorage.setItem('code', code)
            localStorage.setItem('state', state)
            // Clear from current string
            window.history.pushState({}, '', '/')
        }

        if (code && state) {
            console.log('code and state', code, state);

            setCodeAndState({ code, state })
        }
    }, []);

    useEffect(() => {
        if (codeAndState.code && !loading && !accessToken) {
            getAndSetAccessToken(codeAndState.code)
        }
    }, [codeAndState.code])

    return {
        authorize,
        accessToken,
        error,
        loading,
        clearStoreCodeAndState,
    }
}