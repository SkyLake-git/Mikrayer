import { Client } from "bedrock-protocol";
import winston from "winston";
import { Console } from "winston/lib/winston/transports";
import { Packet } from "./packets/packet";
import { LevelChunkHandler } from "./packet_handler";
import { SyncingTicker } from "./tick";
import { EmptyChunkGenerator, World } from './world'

export class MikrayerClient {

	_client: Client | null
	_initialized: boolean
	_world: World | null
	_ticker: SyncingTicker | null

	logger: winston.Logger

	constructor() {
		this._client = null
		this._world = null
		this._ticker = null
		this._initialized = false
		this.logger = winston.createLogger({
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.cli(),
				winston.format.printf(info => `[${info.timestamp}] ${info.level} ${info.message}`)
			),
			transports: [
				new Console()
			]
		})
	}

	getTicker(): SyncingTicker {
		if (this._ticker == null) {
			throw Error("not initialized")
		}

		return this._ticker
	}

	getWorld(): World {
		if (this._world == null) {
			throw Error("not initialized")
		}

		return this._world
	}

	init(client: Client) {
		if (this._initialized) {
			throw Error("already initialized")
		}

		this._client = client
		this._world = new World(new EmptyChunkGenerator())
		this._ticker = new SyncingTicker(50.) // 20tps
		this._initialized = true;

		(new LevelChunkHandler(this.logger, this._world)).apply(client)

		client.on('packet', (pk: Packet) => {
			this.handlePacketReceive(pk)
			this.logger.info("Packet handled: " + pk.data.name)
		})
	}

	handlePacketReceive(packet: Packet) {
		if (!this._initialized) {
			throw Error("cannot handle packets before initialize")
		}
		let data = packet.data

		if (data.name == 'start_game') {
			this.onPlayerSpawn(packet)
		}
	}

	onPlayerSpawn(startGamePacket: Packet) {

	}

	getClient(): Client {
		if (this._client == null) {
			throw Error("not initialized")
		}
		return this._client
	}
}
