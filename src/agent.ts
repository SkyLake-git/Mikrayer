import { QLearningAgent } from "ml-q-learning";
import { MikrayerClient } from "./client";
import { SimulatedPlayer } from "./player";
import { randomPickAction } from 'ml-q-learning/lib/pick-action-strategy'
import { EmptyChunkGenerator, World } from "./world";

enum MikrayerAction {
	forward,
	backward,
	right,
	left,
	aim_up,
	aim_down,
	aim_right,
	aim_left,
	fast_aim_up,
	fast_aim_down,
	fast_aim_right,
	fast_aim_left,
	attack,
	interact
}

export class MikrayerAgent {

	_agent: QLearningAgent | null;
	_simulatedPlayer: SimulatedPlayer | null
	_initialized: boolean;
	_mikrayer: MikrayerClient

	constructor(mikrayer: MikrayerClient) {
		this._agent = null
		this._mikrayer = mikrayer
		this._simulatedPlayer = null
		this._initialized = false
	}

	update(): void {

	}

	init(): void {
		this._agent = new QLearningAgent([
			MikrayerAction.forward,
			MikrayerAction.backward,
			MikrayerAction.right,
			MikrayerAction.left,
			MikrayerAction.aim_up,
			MikrayerAction.aim_down,
			MikrayerAction.aim_right,
			MikrayerAction.aim_left,
			MikrayerAction.fast_aim_up,
			MikrayerAction.fast_aim_down,
			MikrayerAction.fast_aim_right,
			MikrayerAction.fast_aim_left,
			MikrayerAction.attack,
			MikrayerAction.interact
		], randomPickAction)
		this._simulatedPlayer = new SimulatedPlayer(this._mikrayer.getClient(), this._mikrayer.getWorld())
		this._initialized = true

		this._mikrayer.getTicker().on('tick', (nextTickTime: number) => {
			this.getSimulatedPlayer().simulateTick()
			this.getSimulatedPlayer().sendAuthInput()
		})
	}

	getSimulatedPlayer(): SimulatedPlayer {
		if (this._simulatedPlayer == null) {
			throw Error("not initialized")
		}

		return this._simulatedPlayer
	}

	getAgent(): QLearningAgent<number> {
		if (this._agent == null) {
			throw Error("not initialized")
		}

		return this._agent
	}

	performAction(action: MikrayerAction) {

	}
}


