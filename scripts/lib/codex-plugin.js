export function buildCodexPluginManifest(rootManifest) {
  return {
    name: rootManifest.name,
    version: rootManifest.version,
    description: rootManifest.description,
    author: {
      name: rootManifest.author?.name || 'PanKit',
      url: rootManifest.homepage,
    },
    homepage: rootManifest.homepage,
    repository: rootManifest.repository,
    license: 'Apache-2.0',
    keywords: [
      'erpnext',
      'frappe',
      'curtains',
      'sankaku',
    ],
    skills: './skills/',
    interface: {
      displayName: 'PanKit ERPNext',
      shortDescription: 'Implement ERPNext for curtain businesses',
      longDescription: 'Explain client requirements, compare standard ERPNext and custom app options, develop sankaku_erp, rehearse migrations, verify business scenarios and hand over operations. Nine commands support a technical founder learning ERPNext.',
      developerName: rootManifest.author?.name || 'PanKit',
      category: 'Developer Tools',
      capabilities: ['Interactive', 'Read', 'Write'],
      websiteURL: rootManifest.homepage,
      defaultPrompt: [
        'Use $pankit spec to explain this curtain client request and map it to ERPNext.',
        'Use $pankit design to compare standard configuration with a sankaku_erp customization.',
        'Use $pankit test to prepare customer acceptance and migration verification.',
      ],
      brandColor: '#E2AE38',
      composerIcon: './assets/icon.png',
      logo: './assets/icon.png',
      screenshots: [],
    },
  };
}
