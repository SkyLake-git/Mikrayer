import { Vec3 } from 'vec3'

export type PacketData = {
	name: string,
	params: PacketParams
}

export type PacketParams = {}

export type PacketMeta = {
	size: PUInt // signed?
}

export type Packet = {
	data: PacketData
	metadata: PacketMeta,
	buffer: Buffer,
	fullBuffer: Buffer
}

export type PVec3 = {
	x: PFloat,
	y: PFloat,
	z: PFloat
}

export type PVec2 = {
	x: PFloat,
	y: PFloat
}

export type PVecXZ = {
	x: PFloat,
	z: PFloat
}

export type PVec3I = {
	x: PInt,
	y: PInt
}

export type PBlockCoordinates = {
	x: PZigZag32,
	y: PVarInt,
	z: PZigZag32
}

export type ItemStackExtra = {
	//todo: encapsulated
}


export type ItemStack = {
	count: PUInt,
	metadata: PVarInt,
	has_stack_id: number,
	stack_id: number | void | undefined,
	block_runtime_id: PZigZag32,
	extra: ItemStackExtra
}

export type NetworkItem = {
	network_id: PZigZag32,
	item: ItemStack | void | undefined
}

export type PUInt = number // packet unsigned int
export type PInt = number // packet signed int
export type PUFloat = number // packet unsigned float
export type PFloat = number // packet signed float
export type PVarInt = number // idk
export type PZigZag32 = number // idk
