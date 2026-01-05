module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/', 'http://localhost:3000/colaboradores', 'http://localhost:3000/folha'],
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'Local:',
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        throttling: { cpuSlowdownMultiplier: 1 }
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 3000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'interactive': ['warn', { maxNumericValue: 4000 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
