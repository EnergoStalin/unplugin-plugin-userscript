import { userscriptInjectCode } from "@/plugins/inject-code"
import { formatMetadata, type Metadata } from "@/shared/metadata"

export type Options = Metadata

export function userscriptMetadata(options: Options) {
	const metadata = formatMetadata(options)

	return userscriptInjectCode({ at: ["start"], code: `${metadata}\n` })
}
