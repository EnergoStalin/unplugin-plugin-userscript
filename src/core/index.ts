import { createUnplugin, UnpluginOptions } from "unplugin"
import { resolveOptions, type UserscriptOptions } from "./options"
import { userscriptInjectCode, Options as InjectCodePluginOptions } from "./plugins/inject-code"
import { userscriptMetadata, Options as MetadataPluginOptions } from "./plugins/metadata"
import { userscriptProxy, Options as ProxyPluginOptions } from "./plugins/proxy"

export type { Metadata } from "./shared/metadata"

const _userscript = createUnplugin<UserscriptOptions>((options?) => {
	const resolvedOptions = resolveOptions(options)
	const plugins: UnpluginOptions[] = []

	plugins.push(userscriptMetadata(resolvedOptions.metadata))

	for (const injection of resolvedOptions.inject) {
		plugins.push(userscriptInjectCode(injection))
	}

	if (resolvedOptions.proxy) {
		plugins.push(userscriptProxy(resolvedOptions.proxy))
	}

	return plugins
})

export namespace userscript {
	export const userscript = _userscript
	export const metadata = createUnplugin<MetadataPluginOptions>(userscriptMetadata)
	export const injectCode = createUnplugin<InjectCodePluginOptions>(userscriptInjectCode)
	export const proxy = createUnplugin<ProxyPluginOptions>(userscriptProxy)
}
