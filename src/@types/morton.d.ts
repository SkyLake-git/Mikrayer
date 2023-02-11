// by SkyLake-git

export var X: Array<number>
export var Y: Array<number>
export var morton: (x: number, y: number) => number
export default morton

export var code: (z: number, x: number, y: number) => number
export var range: (z: number, x: number, y: number) => number
export var reverse: (c: number) => [number, number]
export var decode: (z: number, c: number) => [number, number]
