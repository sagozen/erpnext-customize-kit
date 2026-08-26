// Source scripts default to slash commands. The provider build replaces only
// this exact declaration, avoiding heuristic rewrites across executable code.
export const PANKIT_COMMAND_PREFIX = '/'; // @pankit-provider-command-prefix
export const PANKIT_PROVIDER_ID = 'source'; // @pankit-provider-id
export const PANKIT_COMMAND = `${PANKIT_COMMAND_PREFIX}pankit`;
