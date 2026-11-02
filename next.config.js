/** @type {import('next').NextConfig} */
const nextConfig = {};

nextConfig.redirects = async () => [
  {
    source: '/login',
    destination: '/View/login',
    permanent: false,
  },
];

module.exports = nextConfig;


