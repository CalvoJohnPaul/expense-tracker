import type {NextConfig} from 'next';

export default {
	output: 'export',
	distDir: 'dist',
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '*',
			},
		],
	},
	reactCompiler: true,
} satisfies NextConfig;
