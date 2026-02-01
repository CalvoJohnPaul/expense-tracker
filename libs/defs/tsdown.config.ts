import {defineConfig} from 'tsdown';

export default defineConfig({
	dts: true,
	clean: false,
	entry: ['./src/**/*.ts'],
	format: ['esm', 'cjs'],
	outDir: 'dist',
	logLevel: 'silent',
	sourcemap: true,
	skipNodeModulesBundle: true,
});
