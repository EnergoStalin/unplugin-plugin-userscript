// Based on trim21/userscript-metadata-generator

import { source } from "common-tags"

export namespace Metadata {
	export type Author =
		| string
		| {
				name: string
				email?: string
				url?: string
		  }

	/**
	 * Serialized as `prop:key value`
	 * Use the "" key for default value `prop key`
	 */
	export type LocalizableString = string | Record<string, string>

	export type Grant =
		| "none"
		| "GM.getValue"
		| "GM_getValue"
		| "GM.setValue"
		| "GM_setValue"
		| "GM.openInTab"
		| "GM.deleteValue"
		| "GM.listValues"
		| "GM.getResourceUrl"
		| "GM.notification"
		| "GM.registerMenuCommand"
		| "GM.setClipboard"
		| "GM.xmlHttpRequest"
		| "unsafeWindow"
		| (string & {})

	export type CustomValue =
		| string
		| string[]
		| undefined
		| null
		| Record<string, string>

	export type InjectionType =
		| "document-end"
		| "document-start"
		| "document-body"
		| "document-idle"
		| "context-menu"
		| (string & {})
}

export type Metadata = {
	name?: Metadata.LocalizableString
	namespace?: string
	description?: Metadata.LocalizableString
	license?: string

	include?: string[] | string
	require?: string[] | string
	connect?: string[] | string
	"run-at"?: Metadata.InjectionType
	version?: string
	author?: Metadata.Author
	resource?: string[] | Record<string, string>
	grant?: Metadata.Grant[] | Metadata.Grant

	[keys: string]: Metadata.CustomValue
}

type FormattedProperty = [key: string, value: string]

function formatAuthor(author: Metadata.Author): string {
	if (typeof author === "string") return author

	let { name } = author

	if (author.email) {
		name += ` <${author.email}>`
	}

	if (author.url) {
		name += ` (${author.url})`
	}

	return name
}

function getMaxLength(strings: string[]): number {
	return strings.map((item) => item.length).reduce((a, b) => Math.max(a, b), 0)
}

function formatField(
	key: string,
	value: Metadata.CustomValue,
): FormattedProperty[] {
	if (typeof value === "string") {
		return [[key, value]]
	}

	if (Array.isArray(value)) {
		return value.map((item) => [key, item])
	}

	if (value === undefined || value === null) {
		return []
	}

	const properties = Object.entries(value)

	return properties.map(([key, value]) => {
		if (key === "") {
			return [`${key}`, value]
		}

		return [`${key}:${key}`, value]
	})
}

function normalizeResources(
	resources: string[] | Record<string, string>,
): string[] {
	if (Array.isArray(resources)) {
		return resources
	}

	const pad = getMaxLength(Object.keys(resources))

	return Object.entries(resources).map(([key, value]) => {
		return `${key.padEnd(pad)} ${value}`
	})
}

export function formatMetadata(metadata: Metadata) {
	const formattedProperties: FormattedProperty[] = []

	for (const [key, value] of Object.entries(metadata)) {
		if (value === undefined || value === null) {
			continue
		}

		if (key === "author") {
			formattedProperties.push([key, formatAuthor(value as Metadata.Author)])

			continue
		}

		if (key === "resource") {
			formattedProperties.push(
				...formatField(
					key,
					normalizeResources(value as Record<string, string>),
				),
			)

			continue
		}

		formattedProperties.push(...formatField(key, value))
	}

	const valuePadding = getMaxLength(formattedProperties.map((x) => x[0])) + 3

	const joinedProperties = formattedProperties
		.map(([key, value]) =>
			`// @${key.padEnd(valuePadding)}${value}`.trimEnd(),
		)
		.join("\n")

	const formattedMetadata = source`
		// ==UserScript==
		${joinedProperties}
		// ==/UserScript==
	`

	return formattedMetadata
}
