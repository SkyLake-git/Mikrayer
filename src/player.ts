
import { Vec3 } from 'vec3'
import { latestRegistries } from './registry'
import { World } from './world'
import { mergeDeeply } from './utils'
import { Client } from 'bedrock-protocol'
import { PlayerAuthInputPacket, PlayerAuthInputData } from './packets/params/player_auth_input'

// todo: self-made physics

export type ExtendedPlayer = Player & {
	entity: {
		pitch: number
	}
}

export class SimulatedPlayer {

	_client: Client
	_state: PlayerState
	_physics: PhysicsSetting
	world: World

	player: ExtendedPlayer
	controls: Controls

	constructor(client: Client, world: World) {
		this._client = client
		let mcData = latestRegistries.minecraft
		this._physics = Physics(mcData, world)
		this.player = {
			entity: {
				position: new Vec3(0, 0, 0),
				velocity: new Vec3(0, 0, 0),
				onGround: false,
				isInWater: false,
				isInLava: false,
				isInWeb: false,
				isCollidedHorizontally: false,
				isCollidedVertically: false,
				yaw: 0,
				pitch: 0
			},
			jumpTicks: 0,
			jumpQueued: false
		}

		this.controls = {
			forward: false,
			back: false,
			left: false,
			right: false,
			jump: false,
			sprint: false,
			sneak: false
		}

		this.world = world

		this._state = new PlayerState(this.player, this.controls)
	}

	sendAuthInput(): void {
		let packet: PlayerAuthInputData = {
			name: "player_auth_input",
			params: {
				pitch: this.player.entity.pitch,
				yaw: this.player.entity.yaw,
				position: this.player.entity.position,
				move_vector: {
					x: 0,
					z: 0
				},
				head_yaw: this.player.entity.yaw,
				input_data: 0,
				input_mode: "unknown",
				play_mode: "normal",
				interaction_model: "crosshair",
				gaze_direction: void 0,
				tick: 0,
				delta: new Vec3(0, 0, 0),
				transaction: void 0,
				item_stack_request: void 0,
				block_action: void 0
			}
		}
		this._client.queue(packet.name, packet.params)
	}

	simulateTick(): void {
		if (this._physics.simulatePlayer == undefined) {
			return
		}

		this.player = mergeDeeply(this._physics.simulatePlayer(this._state, this.world), this.player)
		this._state = new PlayerState(this.player, this.controls)

		//todo: work here
	}
}
