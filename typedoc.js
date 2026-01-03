module.exports = {
  entryPoints: ['./src/index.ts'],
  entryPointStrategy: 'expand',
  out: './docs/typedoc-md',
  plugin: ['typedoc-plugin-markdown'],
  tsconfig: './tsconfig.json',
  exclude: ['**/node_modules/**', '**/tests/**', '**/dist/**'],
  excludePrivate: false,
  excludeProtected: false,
  includeVersion: true,
  readme: 'none',
  disableSources: false,
  categorizeByGroup: true,
  categoryOrder: ['Classes', 'Functions', 'Variables', '*'],
  sort: ['source-order']
};
