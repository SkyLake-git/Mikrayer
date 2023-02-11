import { Packet, PacketData, PacketParams, PVarInt, PZigZag32 } from "../packet";

export type ChunkHash = {
	countType: PVarInt,
	type: number
}

export type LevelChunkCache = {
	hashes: ChunkHash[]
}

export type LevelChunkData = PacketData & {
	name: "level_chunk",
	params: LevelChunkParams
}

export type LevelChunkParams = PacketParams & {
	x: PZigZag32,
	z: PZigZag32,
	sub_chunk_count: PVarInt,
	highest_subchunk_count: number | void | undefined,
	cache_enabled: boolean,
	blobs: LevelChunkCache | void | undefined,
	payload: Buffer
}

export type LevelChunkPacket = Packet & {
	data: LevelChunkData
}
