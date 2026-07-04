import type { UnpluginOptions } from "unplugin"
import { createUnplugin } from "unplugin"
import { resolveOptions, type UserscriptOptions } from "./options"
import type { Options as InjectCodePluginOptions } from "./plugins/inject-code"
import { userscriptInjectCode } from "./plugins/inject-code"
import type { Options as MetadataPluginOptions } from "./plugins/metadata"
import { userscriptMetadata } from "./plugins/metadata"
import type { Options as ProxyPluginOptions } from "./plugins/proxy"
import { userscriptProxy } from "./plugins/proxy"

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
	export const metadata =
		createUnplugin<MetadataPluginOptions>(userscriptMetadata)
	export const injectCode =
		createUnplugin<InjectCodePluginOptions>(userscriptInjectCode)
	export const proxy = createUnplugin<ProxyPluginOptions>(userscriptProxy)
}
