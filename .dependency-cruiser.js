module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: '循環依存を禁止',
      from: {},
      to: {
        circular: true
      }
    },
    {
      name: 'no-orphans',
      severity: 'warn',
      comment: '未使用ファイルを警告',
      from: {
        orphan: true,
        pathNot: [
          '(^|/)\\.[^/]+\\.(js|cjs|mjs|ts|json)$',
          '\\.d\\.ts$',
          '(^|/)tsconfig\\.json$',
          '(^|/)(babel|webpack)\\.config\\.(js|cjs|mjs|ts|json)$'
        ]
      },
      to: {}
    },
    {
      name: 'no-deprecated-core',
      comment: '非推奨のNode.js coreモジュールを禁止',
      severity: 'warn',
      from: {},
      to: {
        dependencyTypes: [
          'core'
        ],
        path: [
          '^(punycode|domain|constants|sys|_linklist)$'
        ]
      }
    },
    {
      name: 'not-to-deprecated',
      comment: '非推奨のnpmモジュールを禁止',
      severity: 'warn',
      from: {},
      to: {
        dependencyTypes: [
          'deprecated'
        ]
      }
    },
    {
      name: 'no-non-package-json',
      severity: 'error',
      comment: 'package.jsonに記載されていない依存を禁止',
      from: {},
      to: {
        dependencyTypes: [
          'npm-no-pkg',
          'npm-unknown'
        ]
      }
    }
  ],
  options: {
    doNotFollow: {
      path: 'node_modules'
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: './tsconfig.json'
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default']
    },
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/[^/]+'
      },
      archi: {
        collapsePattern: '^(node_modules|packages|src|lib|app|bin|test|spec)/[^/]+'
      },
      text: {
        highlightFocused: true
      }
    }
  }
};
