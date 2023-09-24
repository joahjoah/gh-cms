import { useEffect, useState } from 'react'
import './App.css'
import useAuthorize from './useAuthorize'
import { GithubWrapper } from './github';

function App() {
  const { authorize, accessToken, error, clearStoreCodeAndState } = useAuthorize()
  const [repos, setRepos] = useState<any[]>([]);

  useEffect(() => {
    async function getRepos(accessToken: string) {
      const wrapper = new GithubWrapper(accessToken);
      const repos = await wrapper.getRepos();
      const myRepos = repos.filter((repo) => repo.owner.login === 'joahjoah');
      setRepos(myRepos)
    }
    if (accessToken) {
      getRepos(accessToken)
    }
  }, [accessToken]);

  return (
    <>
      <h1>Hej</h1>
      {
        error && (
          <>
            <h1>Error</h1>
            <p>{error|| 'unknown error...'}</p>
            <button onClick={() => clearStoreCodeAndState()}>Clear</button>
          </>
        )
      }
      {
        accessToken ? <h1>Authorized</h1> : <button onClick={() => authorize()}>Login</button>
      }
      <ul style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          listStyle: 'none'
        }}>
        {
          repos.map(repo => <li key={repo.id}>{repo.name}</li>)
        }
      </ul>
    </>
  )
}

export default App
