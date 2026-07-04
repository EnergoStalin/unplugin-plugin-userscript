import { defineConfig } from "tsdown"

// eslint-disable-next-line import/no-default-export
export default defineConfig({
	entry: ["src/*.ts"],
	outDir: "build",
	format: ["esm", "cjs"],
	dts: true,
	clean: false,
	target: false,
})
