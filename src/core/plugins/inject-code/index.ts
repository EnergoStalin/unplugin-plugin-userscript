import { definePlugin } from "@/shared/definePlugin"
import { source } from "common-tags"

export type Options = {
	at: ("start" | "end")[]
	code: string | ((text: string) => string)
}

function transform(options: Options, text: string) {
	const { at, code } = options

	const codeText = typeof code === "function" ? code(text) : code

	let resultText = text

	if (at.includes("start")) {
		resultText = source`
			${codeText}
			${resultText}
		`
	}

	if (at.includes("end")) {
		resultText = source`
			${resultText}
			${codeText}
		`
	}

	return resultText
}

export function userscriptInjectCode(options: Options) {
	const { at } = options

	return definePlugin({
		name: "unplugin-plugin-userscript-inject-code",
		rolldown: {
			outputOptions(o) {
				if (at.includes("start")) {
					o.postBanner = (chunk) => chunk.fileName.endsWith(".user.js") ? transform(options, "") : ""
				}
				if (at.includes("end")) {
					o.postFooter = (chunk) => chunk.fileName.endsWith(".user.js") ? transform(options, "") : ""
				}
			}
		}
	})
}
