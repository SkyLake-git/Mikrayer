import { EventEmitter } from "stream"

export class SyncingTicker extends EventEmitter {

	_count: number
	interval: number
	_lastTickTime: number
	_nextTickTime: number
	_started: boolean
	_timeoutId: NodeJS.Timeout | null

	constructor(interval: number) {
		super()
		this._count = 0
		this.interval = interval
		this._started = false
		this._lastTickTime = 0
		this._nextTickTime = 0
		this._timeoutId = null
	}

	start(): void {
		if (this._started) {
			throw Error("already started")
		}

		this._nextTickTime = new Date().getTime()
		this._lastTickTime = 0

		this._started = true

		this._scheduleNextTick()
	}

	stop(): void {
		if (this._started && this._timeoutId != null) {
			clearTimeout(this._timeoutId)
			this._started = false
		}
	}

	getTick(): number {
		return this._count
	}

	tick(): number {
		this._count++;

		this.emit('tick', this._nextTickTime)

		return this._count
	}

	syncNow(tick: number): void {
		let late = tick > this._count

		let time = new Date().getTime()
		let diff = this._nextTickTime - time

		if (late) {
			this._nextTickTime -= diff
		} else {
			this._nextTickTime += diff
		}
	}

	_scheduleNextTick(): void {
		let time = new Date().getTime()
		this.emit('schedule', time)

		this._timeoutId = setTimeout(() => {
			this._nextTickTime += this.interval

			this.tick()

			this._lastTickTime = new Date().getTime()

			this._scheduleNextTick()
		}, this._nextTickTime - time)
	}
}
