const Ajv = require("ajv");

const schema = {
    type: 'object',
    properties: {
        purchases: {
            type: 'object',
            properties: {
                passes:             { type: 'integer' },
                developer_products: { type: 'integer' },
                subscriptions:      { type: 'integer' }
            },
            required: ['passes', 'developer_products', 'subscriptions'],
            additionalProperties: false
        },
        performance: {
            type: 'object',
            properties: {
                memory:            { type: 'number' },
                data_send:         { type: 'number' },
                physics_step:      { type: 'number' },
                fps:               { type: 'number' },
                physics_send:      { type: 'number' },
                physics_receive:   { type: 'number' },
                instances:         { type: 'number' },
                moving_primitives: { type: 'number' },
                heartbeat:         { type: 'number' },
                primitives:        { type: 'number' },
                data_receive:      { type: 'number' }
            },
            required: ['memory', 'data_send', 'physics_step', 'fps', 'physics_send', 'physics_receive', 'instances', 'moving_primitives', 'heartbeat', 'primitives', 'data_receive'],
            additionalProperties: false
        },
        social: {
            type: 'object',
            properties: {
                friends_playing: { type: 'integer' },
                chats:           { type: 'integer' }
            },
            required: ['friends_playing', 'chats'],
            additionalProperties: false
        },
        players: {
            type: 'object',
            properties: {
                active:    { type: 'integer' },
                new:       { type: 'integer' },
                returning: { type: 'integer' },
                premium:   { type: 'integer' },
                engagement: {
                    type: 'object',
                    properties: {
                        average_session_duration:   { type: 'number' }
                    },
                    required: ['average_session_duration'],
                    additionalProperties: false
                },
                // retention: {
                //     type: 'object',
                //     properties: {
                        
                //     },
                //     required: [],
                //     additionalProperties: false
                // },
                demographics: {
                    type: 'object',
                    properties: {
                        regions: { type: 'object' },
                        average_account_age: { type: 'number' }
                    },
                    required: ['regions', 'average_account_age'],
                    additionalProperties: false
                }
            },
            required: ['active', 'new', 'returning', 'premium', 'demographics'],
            additionalProperties: false
        },
        metadata: {
            type: 'object',
            properties: {
                uptime:    { type: 'integer' },
                timestamp: { type: 'number' },
                creator: {
                    type: 'object',
                    properties: {
                        id:   { type: 'integer' },
                        type: { type: 'string' }
                    },
                    required: ['id', 'type'],
                    additionalProperties: false
                },
                place: {
                    type: 'object',
                    properties: {
                        id:      { type: 'integer' },
                        name:    { type: 'string' },
                        version: { type: 'integer' }
                    },
                    required: ['id', 'name', 'version'],
                    additionalProperties: false
                },
                game: {
                    type: 'object',
                    properties: {
                        id:   { type: 'integer' },
                        name: { type: 'string' }
                    },
                    required: ['id', 'name'],
                    additionalProperties: false
                },
                server: {
                    type: 'object',
                    properties: {
                        id:   { type: 'string' },
                        type: { type: 'string' },
                        size: { type: 'integer' }
                    },
                    required: ['id', 'type', 'size'],
                    additionalProperties: false
                },
                geo: {
                    type: 'object',
                    properties: {
                        user_agent:  {
                            type: 'object',
                            properties: {
                                comment: { type: 'string' },
                                product: { type: 'string' },
                                raw_value: { type: 'string' }
                            },
                            required: ['comment', 'product', 'raw_value'],
                            additionalProperties: false
                        },
                        longitude:   { type: 'number' },
                        asn_org:     { type: 'string' },
                        country:     { type: 'string' },
                        time_zone:   { type: 'string' },
                        ip_decimal:  { type: 'integer' },
                        metro_code:  { type: 'integer' },
                        ip:          { type: 'string' },
                        asn:         { type: 'string' },
                        latitude:    { type: 'number' },
                        city:        { type: 'string' },
                        zip_code:    { type: 'string' },
                        region_name: { type: 'string' },
                        country_eu:  { type: 'boolean' },
                        region_code: { type: 'string' },
                        country_iso: { type: 'string' }
                    },
                    required: ['longitude', 'asn_org', 'country', 'time_zone', 'ip_decimal', 'metro_code', 'ip', 'asn', 'latitude', 'city', 'zip_code', 'region_name', 'country_eu', 'region_code', 'country_iso'],
                    additionalProperties: false
                }
            },
            required: ['geo', 'uptime', 'creator', 'place', 'timestamp', 'game', 'server'],
            additionalProperties: false
        }
    },
    required: ['performance', 'players', 'metadata'],
    additionalProperties: false
}

const ajv = new Ajv();
const validate = ajv.compile(schema);

async function logAnalytics(analytics) {

}

async function logPurchases(purchases) {

}

async function logPerformance(performance) {

}

async function logSocial(social) {

}

async function logPlayers(players) {

}

async function logData(req, res) {
    // Check if the req.body exists
    const data = req.body;
    if (!data) {
        return res.status(400).json({ message: 'Missing Data' });
    }

    // Check data against schema - if it fails, send error code 400 Bad Request
    const valid = validate(data);
    if (!valid) {
        console.log(validate.errors);
        return res.status(400).json({ message: 'Bad Data Types' });
    }

    // Send the sections to be logged to the other functions
    logAnalytics(data.analytics);
    logPurchases(data.purchases);
    logPerformance(data.performance);
    logSocial(data.social);
    logPlayers(data.players);

    console.log(req.body);
    res.status(200).json({ message: 'Data successfully recieved' });
}

module.exports = {
    logData
}
