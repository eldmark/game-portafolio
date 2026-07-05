const SINGLE_COMMIT_PHRASES = [
  'Pushed a new commit to {repo}.',
  'Shipped a small update to {repo}.',
  'Made progress on {repo}.',
  'Tinkered with {repo} a bit more.',
  'Committed new changes to {repo}.',
  'Polished something in {repo}.',
];

const MULTI_COMMIT_PHRASES = [
  'Pushed {count} commits to {repo}.',
  'Landed a batch of {count} changes in {repo}.',
  'Big push today — {count} commits to {repo}.',
  'Made {count} updates to {repo}.',
  'Cranked out {count} commits for {repo}.',
];

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)] as T;
}

export function buildDevlogMessage(repoFullName: string, commitCount: number): string {
  const repoName = repoFullName.split('/')[1] ?? repoFullName;
  const template =
    commitCount > 1 ? pickRandom(MULTI_COMMIT_PHRASES) : pickRandom(SINGLE_COMMIT_PHRASES);

  return template.replace('{repo}', repoName).replace('{count}', String(commitCount));
}
