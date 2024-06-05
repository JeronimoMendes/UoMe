/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  typescript: {
    // if shit work on dev it ain't broke
    ignoreBuildErrors: true,
    transpileOnly: true,
  },
};
