import { Vec3 } from "vec3"
import { Block } from 'prismarine-block'
import { BedrockChunk, CommonChunk, ExtendedBlock } from 'prismarine-chunk'
import chunk from 'prismarine-chunk'
import morton_2d from 'morton'
import { latestRegistries } from './registry'
import { EventEmitter } from 'events'
import { Entity, EntityType } from "prismarine-entity"
import { VecXZ } from "./vectors"

export type ChunkCoord = number // >> 4 shifted
export type ChunkPosition = {
	x: ChunkCoord,
	z: ChunkCoord
}

export interface WorldBlockDataProvider {
	getBlock(position: Vec3, full?: boolean): Block
}

export interface IChunkGenerator {
	generate(x: ChunkCoord, z: ChunkCoord, chunkType: typeof BedrockChunk): BedrockChunk
}

export class EmptyChunkGenerator implements IChunkGenerator {
	generate(x: number, z: number, chunkType: typeof BedrockChunk): BedrockChunk {
		return new chunkType({ x, z })
	}
}

export class World extends EventEmitter implements WorldBlockDataProvider {

	chunks: BedrockChunk[]
	_entities: Map<number, Entity>
	_players: Map<number, Entity>

	_defaultChunkGenerator: IChunkGenerator

	constructor(defaultChunkGenerator: IChunkGenerator) {
		super()
		this.chunks = []
		this._entities = new Map()
		this._players = new Map()

		this._defaultChunkGenerator = defaultChunkGenerator
	}

	addEntity(entity: Entity): void {
		this._entities.set(entity.id, entity)

		if (entity.type == 'player') {
			this._players.set(entity.id, entity)
		}

		this.emit("entity_add", entity)
	}

	getEntity(id: number): Entity | null {
		return this._entities.get(id) ?? null
	}

	getPlayer(id: number): Entity | null {
		return this._players.get(id) ?? null
	}

	toChunkCoord(v: number): ChunkCoord {
		return Math.floor(v) >> 4
	}

	toChunkPosition(v: VecXZ): ChunkPosition {
		return { x: this.toChunkCoord(v.x), z: this.toChunkCoord(v.z) }
	}

	getChunkHash(x: ChunkCoord, z: ChunkCoord): number {
		return morton_2d(x, z)
	}

	getChunkFrom(x: number, z: number): BedrockChunk {
		return this.getChunk(this.toChunkCoord(x), this.toChunkCoord(z))
	}

	getChunk(x: ChunkCoord, z: ChunkCoord): BedrockChunk {
		let hash: number = this.getChunkHash(x, z)
		let chunk: BedrockChunk | null = this.chunks[hash]

		if (chunk == null) {
			let newChunk: BedrockChunk = this._defaultChunkGenerator.generate(x, z, latestRegistries.chunk)
			this._setChunk(x, z, newChunk)

			return newChunk
		}

		return chunk
	}

	_setChunk(x: ChunkCoord, z: ChunkCoord, chunk: BedrockChunk, overwrite?: boolean): void {
		let hash: number = this.getChunkHash(x, z)

		if (!overwrite && this.chunks[hash]) {
			throw Error("cannot overwrite")
		}

		this.chunks[hash] = chunk
	}

	getBlock(position: Vec3, full?: boolean): Block {
		let floorPos: Vec3 = position.floor()
		let chunk: BedrockChunk = this.getChunkFrom(floorPos.x, floorPos.y)

		return chunk.getBlock(floorPos, full)
	}

	setBlock(position: Vec3, block: ExtendedBlock): void {
		let floorPos = position.floor()

		block.position = floorPos.clone()

		let chunk: BedrockChunk = this.getChunkFrom(floorPos.x, floorPos.y)
		let oldBlock: ExtendedBlock = chunk.getBlock(floorPos)

		chunk.setBlock(floorPos, block)

		this.emit("block_changed", chunk, block, oldBlock)
	}
}
