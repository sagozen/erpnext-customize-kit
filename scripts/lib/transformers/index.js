import { createTransformer } from './factory.js';
import { PROVIDERS } from './providers.js';

// Named exports exist primarily as stable spy targets for the test suite
// (build.test.js uses spyOn(transformers, 'transformCursor') etc.). The build
// itself uses createTransformer + PROVIDERS directly, not these. Keep one
// export per entry in PROVIDERS; adding a provider without adding its export
// here leaves the suite unable to spy on it.
export const transformCursor = createTransformer(PROVIDERS.cursor);
export const transformClaudeCode = createTransformer(PROVIDERS['claude-code']);
export const transformCodex = createTransformer(PROVIDERS.codex);
export const transformAgents = createTransformer(PROVIDERS.agents);

export { createTransformer, PROVIDERS };
