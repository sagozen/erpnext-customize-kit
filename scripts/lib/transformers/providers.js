/**
 * Provider configurations for the transformer factory.
 *
 * Each config specifies:
 * - provider: key into PROVIDER_PLACEHOLDERS (e.g. 'claude-code')
 * - configDir: dot-directory name (e.g. '.claude')
 * - displayName: human-readable name for log output (e.g. 'Claude Code')
 * - providerTags: markdown block tags kept for this target (e.g. <codex>...</codex>)
 * - frontmatterFields: which optional fields to emit beyond name + description
 * - bodyTransform: optional function (body, skill) => transformed body
 */
export const PROVIDERS = {
  cursor: {
    provider: 'cursor',
    providerTags: ['cursor'],
    configDir: '.cursor',
    displayName: 'Cursor',
    frontmatterFields: ['license', 'compatibility', 'metadata'],
    // Cursor subagents: `.cursor/agents/<name>.md` at repo level,
    // `~/.cursor/agents/` at user level. Project agents take precedence over
    // user ones, so installs simply overwrite on update.
    agentFormat: 'cursor-md',
    emitHooks: 'cursor',
    // Cursor reads `.cursor/hooks.json`, not `.cursor/hooks/hooks.json`.
    hooksManifestRel: 'hooks.json',
  },
  'claude-code': {
    provider: 'claude-code',
    providerTags: ['claude-code', 'claude'],
    configDir: '.claude',
    displayName: 'Claude Code',
    frontmatterFields: ['user-invocable', 'argument-hint', 'license', 'compatibility', 'metadata', 'allowed-tools'],
    agentFormat: 'claude-md',
    emitHooks: 'claude',
    // Project-local Claude Code hooks live in `.claude/settings.json`.
    hooksManifestRel: 'settings.json',
  },
  codex: {
    provider: 'codex',
    providerTags: ['codex'],
    configDir: '.codex',
    displayName: 'Codex',
    frontmatterFields: [],
    writeOpenAIMetadata: true,
    // No agentFormat: the Codex subagent ships nested inside the skill's own
    // agents/ folder (see CODEX_SKILL_PROVIDERS in factory.js), which Codex
    // auto-discovers on install. No top-level .codex/agents/ sidecar is emitted.
    emitHooks: 'codex',
    // Codex discovers project-local hooks at `.codex/hooks.json`.
    hooksManifestRel: 'hooks.json',
  },
  agents: {
    provider: 'agents',
    providerTags: ['agents', 'codex'],
    configDir: '.agents',
    displayName: 'Codex Repo Skills',
    placeholderProvider: 'codex',
    frontmatterFields: [],
    writeOpenAIMetadata: true,
  },
};
