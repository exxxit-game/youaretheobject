// Resource guard, independent of which assistant launches the script.
// The owner's two-core laptop must not render automated WebGL/VR runs.
// GitHub documents RUNNER_ENVIRONMENT as github-hosted or self-hosted:
// https://docs.github.com/en/actions/reference/workflows-and-actions/variables
export function assertBrowserHost(env = process.env, platform = process.platform) {
  if (env.GITHUB_ACTIONS !== 'true' || env.RUNNER_ENVIRONMENT !== 'github-hosted' || platform !== 'linux') {
    throw new Error('Heavy browser checks run only on GitHub-hosted Linux. Keep this laptop free; use the test workflow.');
  }
}
