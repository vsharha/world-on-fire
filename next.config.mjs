/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
    reactCompiler: true,
    images: {
        remotePatterns: [{ hostname: '**' }], // allow all remote hosts
    },
};

export default nextConfig;
