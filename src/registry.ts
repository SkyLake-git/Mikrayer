import { BedrockChunk, PCChunk } from "prismarine-chunk";
import { IndexedData } from 'minecraft-data'
import dataLoader from 'minecraft-data'
import chunkLoader from 'prismarine-chunk'
import registryLoader from 'prismarine-registry'
import { Block } from 'prismarine-block'
const loader = require('prismarine-block')

export class DataRegistries {

	minecraft: IndexedData
	chunk: typeof BedrockChunk
	block: typeof Block

	constructor(version: string) {
		this.minecraft = dataLoader(version)

		let registry = registryLoader(version)

		// any hack: (typeof BedrockChunk | typeof PCChunk)
		let chunkType: (any) = chunkLoader(version)

		if (typeof chunkType == typeof PCChunk) {
			throw Error("only accept bedrock chunk type")
		}

		let bedrockChunkType: typeof BedrockChunk = chunkType
		this.chunk = bedrockChunkType

		this.block = loader(registry)
	}
}


export let latestRegistries = new DataRegistries("bedrock_1.19.60")

export function get(version: string): DataRegistries {
	return new DataRegistries(version)
}
