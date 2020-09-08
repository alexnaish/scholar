module.exports = {
  title: 'Scholar',
  tagline: 'Visual regression platform',
  url: 'https://scholar.naish.io',
  baseUrl: '/docs/',
  onBrokenLinks: 'ignore',
  favicon: 'img/favicon.ico',
  organizationName: 'alexnaish', // Usually your GitHub org/user name.
  projectName: 'scholar', // Usually your repo name.
  themeConfig: {
    colorMode: {
      disableSwitch: true,
    },
    navbar: {
      title: 'Scholar',
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'right',
        },
        {
          href: 'https://github.com/alexnaish/scholar',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Application',
          items: [
            {
              label: 'Home',
              to: 'https://scholar.naish.io',
            }
          ],
        },
        {
          title: 'Useful Links',
          items: [
            {
              label: 'About',
              href: 'https://scholar.naish.io/about',
            },
            {
              label: 'Privacy',
              href: 'https://scholar.naish.io/privacy',
            },
          ],
        },
        {
          title: 'Other Links',
          items: [
            {
              label: 'Code Repository',
              href: 'https://github.com/alexnaish/scholar',
            },
            {
              label: 'Unsplash',
              href: 'https://unsplash.com/',
            },
            {
              label: 'Icons CDN',
              href: 'https://icons8.com/',
            },
            {
              label: 'Undraw',
              href: 'https://undraw.co/',
            }
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Scholar.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/alexnaish/scholar/edit/master/documentation/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
