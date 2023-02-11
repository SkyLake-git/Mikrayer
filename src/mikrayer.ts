import protocol = require('bedrock-protocol');
import { QLearningAgent } from 'ml-q-learning';
import { MikrayerAgent } from './agent';
import { MikrayerClient } from './client';
const mikrayer = new MikrayerClient();
process.env.DEBUG = 'minecraft-protocol'

const address = {
	host: 'localhost',
	port: 19132
}

const bedrockClient = protocol.createClient({
	host: address.host,
	port: address.port,
	username: 'Mikrayer',
	offline: true
})

mikrayer.init(bedrockClient)


const agent = new MikrayerAgent(mikrayer)
agent.init()
