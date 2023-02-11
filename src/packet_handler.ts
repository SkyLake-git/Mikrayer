import { EventEmitter } from "stream";
import winston from "winston";
import { Packet, PacketData, PacketParams } from "./packets/packet";
import { LevelChunkData, LevelChunkPacket, LevelChunkParams } from "./packets/params/level_chunk"
import { World } from "./world";


export abstract class SinglePacketHandler<T extends PacketParams> {

	_logger: winston.Logger

	constructor(logger: winston.Logger) {
		this._logger = logger
	}

	abstract getPacketName(): string

	apply(client: EventEmitter): void {
		client.on(this.getPacketName(), (packet: T) => {
			this.handle(packet)

			this._logger.info(`[Packet: ${this.getPacketName()}] handled`)
		})
	}

	abstract handle(packet: T): any
}


export class LevelChunkHandler extends SinglePacketHandler<LevelChunkParams>{

	_world: World

	constructor(logger: winston.Logger, world: World) {
		super(logger);
		this._world = world
	}

	getPacketName(): string {
		return "level_chunk"
	}

	handle(packet: LevelChunkParams): void {
		let chunk = this._world.getChunk(packet.x, packet.z)

		chunk.networkDecodeNoCache(packet.payload, packet.sub_chunk_count)
	}

}
