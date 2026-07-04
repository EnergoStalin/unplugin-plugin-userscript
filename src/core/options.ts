import type { Options as InjectOptions } from "./plugins/inject-code"
import type { Options as ProxyOptions } from "./plugins/proxy"
import type { Metadata } from "./shared/metadata"

export type UserscriptOptions = {
	metadata?: Metadata
	inject?: InjectOptions[]
	proxy?: ProxyOptions | boolean
}

export function resolveOptions(options: UserscriptOptions = {}) {
	return {
		...options,
		metadata: options.metadata ?? {},
		inject: options.inject ?? [],
		proxy: options.proxy === true ? {} : options.proxy,
	}
}

export type ResolvedOptions = ReturnType<typeof resolveOptions>
