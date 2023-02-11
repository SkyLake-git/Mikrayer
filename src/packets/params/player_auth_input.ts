import { ItemStack, NetworkItem, Packet, PacketData, PacketParams, PBlockCoordinates, PUInt, PVarInt, PVec3, PVec3I, PVecXZ, PZigZag32 } from "../packet";

enum InputFlags {
}

export type InputMode = 'unknown' | 'mouse' | 'touch' | 'game_pad' | 'motion_controller'
export type PlayMode = 'normal' | 'teaser' | 'screen' | 'viewer' | 'reality' | 'placement' | 'living_room' |
	'exit_level' | 'exit_level_living_room' | 'num_modes'
export type InteractionModel = 'touch' | 'crosshair' | 'classic'
export type TransactionUseItemActionType = 'click_block' | 'click_air' | 'break_block'
export type ItemStackRequestActionTypeType = 'take' | 'place' | 'swap' | 'drop' | 'destroy' | 'consume' |
	'create' | 'place_in_container' | 'take_out_container' | 'lab_table_combine' | 'beacon_payment' |
	'mine_block' | 'craft_recipe' | 'craft_recipe_auto' | 'craft_creative' | 'optional' |
	'craft_grindstone_request' | 'craft_loom_request' | 'non_implemented' | 'results_deprecated'
export type PlayerAction = 'start_break' | 'abort_break' | 'stop_break' | 'get_updated_block' |
	'drop_item' | 'start_sleeping' | 'stop_sleeping' | 'respawn' | 'jump' | 'start_sprint' | 'stop_sprint' |
	'start_sneak' | 'stop_sneak' | 'creative_player_destroy_block' | 'dimension_change_ack' | 'start_glide' |
	'stop_glide' | 'build_denied' | 'crack_break' | 'change_skin' | 'set_enchatnment_seed' | // enchatnment: minecraft-data's typo (L2226)
	'swimming' | 'stop_swimming' | 'start_spin_attack' | 'stop_spin_attack' | 'interact_block' |
	'predict_break' | 'continue_break' | 'start_item_use_on' | 'stop_item_use_on' | 'handled_teleport'

export type TransactionLegacy = {
	legacy_request_id: number,
	legacy_transactions: TransactionLegacyContent[] | void | undefined
}

export type TransactionLegacyContent = {
	countType: number,
	type: {
		container_id: number,
		changed_slots: TransactionLegacySlotChange[]
	}
}

export type TransactionLegacySlotChange = {
	countType: number,
	type: {
		slot_id: number
	}
}

export type TransactionUseItem = {
	action_type: TransactionUseItemActionType,
	block_position: PVec3I,
	face: PUInt,
	hotbar_slot: PUInt,
	held_item: NetworkItem,
	player_pos: PVec3,
	click_pos: PVec3,
	block_runtime_id: PVarInt
}

export type TransactionContainer = {
	legacy: TransactionLegacy,
	// todo: actions
	data: TransactionUseItem
}

export type ItemStackRequest = {
	request_id: PVarInt,
	actions: ItemStackRequestAction[]
}

export type ItemStackRequestAction = {
	countType: PVarInt,
	type: ItemStackRequestActionType
}

export type ItemStackRequestActionType = {
	type_id: ItemStackRequestActionTypeType,
	// todo: switch type(L2274~)
}

export type BlockAction = {
	countType: PZigZag32,
	action: PlayerAction,

	// only set (start_break, abort_break, crack_break, predict_break, continue_break)
	position: PBlockCoordinates | void | undefined,
	face: PZigZag32 | void | undefined
}

export type PlayerAuthInputData = PacketData & {
	name: "player_auth_input",
	params: PlayerAuthInputParams
}

export type PlayerAuthInputParams = PacketParams & {
	pitch: number,
	yaw: number,
	position: PVec3,
	move_vector: PVecXZ,
	head_yaw: number,
	input_data: number,
	input_mode: InputMode | number,
	play_mode: PlayMode | number,
	interaction_model: InteractionModel | number,
	gaze_direction: PVec3 | void | undefined,
	tick: number,
	delta: PVec3,
	transaction: TransactionContainer | void | undefined,
	item_stack_request: ItemStackRequest | void | undefined
	block_action: BlockAction[] | void | undefined
}

export type PlayerAuthInputPacket = Packet & {
	data: PlayerAuthInputData
}
