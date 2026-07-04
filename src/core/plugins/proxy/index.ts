import { source } from "common-tags"
import { createHash } from "node:crypto"
import { definePlugin } from "@/shared/definePlugin"
import { formatMetadata, type Metadata } from "@/shared/metadata"

type ProxyTargets = string[] | ((name: string) => boolean)

type OutputFile = {
	hash: string,
	text: string,
	path: string
}

export type Options = {
	metadata?: Metadata
	port?: number
	targets?: ProxyTargets
	outFile?: (targetPath: string) => string
}

function resolveOutFile(targetPath: string, options: Options) {
	if (!options.outFile) {
		return targetPath.replace(/^.*?\./, "$&proxy.")
	}

	return options.outFile(targetPath)
}

function createProxyScript(
	targetPath: string,
	options: Options,
) {
	const metadata: Metadata = {
		...options.metadata,
		grant: ["GM.xmlHttpRequest", ...(options.metadata?.grant ?? [])],
		connect: ["127.0.0.1", ...[options.metadata?.connect ?? []].flat()],
	}

	const text = source`
		${formatMetadata(metadata)}

		(async function () {
			GM.xmlHttpRequest({
				method: "GET",
				url: "http://127.0.0.1:${options.port ?? "8080"}/${targetPath}",
				onload: function(response) {
					eval(response.responseText)
				},
			})
		})()
	`

	const proxyScriptFile: OutputFile = {
		path: resolveOutFile(targetPath, options),
		hash: createHash("md5").update(text).digest("hex"),
		text,
	}

	return proxyScriptFile
}

function validateTarget(path: string, targets?: ProxyTargets) {
	if (!targets) {
		return true
	}

	if (Array.isArray(targets) && !targets.includes(path)) {
		return false
	}

	if (!Array.isArray(targets) && !targets(path)) {
		return false
	}

	return true
}

export function userscriptProxy(options: Options = {}) {
	return definePlugin({
		name: "unplugin-plugin-userscript-proxy",
		rolldown: {
			generateBundle(_, b) {
				for (const file of Object.keys(b).filter((k) => validateTarget(k, options.targets))) {
					const userscript = createProxyScript(file, options)
					this.emitFile({
						type: "prebuilt-chunk",
						code: userscript.text,
						name: userscript.path,
						fileName: userscript.path
					})
				}
			}
		}
	})
}
