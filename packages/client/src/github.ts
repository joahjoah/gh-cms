import { Octokit } from '@octokit/core';

export class GithubWrapper {
      octokit: Octokit;
      constructor(auth: string) {
            this.octokit = new Octokit({ auth });
      }

      async getRepos() {
            const response = await this.octokit.request('GET /user/repos', {
                  sort: 'updated',
                  direction: 'desc'
            });
            console.log('response', response.data)
            return response.data;
      }
}
