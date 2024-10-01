const dataSchema = {
    type: 'object',
    properties: {
        analytics: {
            type: 'object',
            properties: {
                
            }
        },
        purchases: {
            type: 'object',
            properties: {
                
            }
        },
        performance: {
            type: 'object',
            properties: {
                total_memory_usage_mb:   { type: 'number' },
                data_send_kbps:          { type: 'number' },
                physics_step_time_ms:    { type: 'number' },
                fps:                     { type: 'number' },
                physics_send_kbps:       { type: 'number' },
                physics_receive_kbps:    { type: 'number' },
                instance_count:          { type: 'integer' },
                moving_primitives_count: { type: 'integer' },
                heartbeat_time:          { type: 'number' },
                primitives_count:        { type: 'integer' },
                data_receive_kbps:       { type: 'number' }
            }
        },
        social: {
            type: 'object',
            properties: {
                
            }
        },
        players: {
            type: 'object',
            properties: {
                active:    { type: 'integer' },
                new:       { type: 'integer' },
                returning: { type: 'integer' },
                premium:   { type: 'integer' },
                demographics: {
                    type: 'object',
                    properties: {
                        regions: { type: 'object' },
                        average_account_age: { type: 'number' }
                    }
                }
            }
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
                    }
                },
                place: {
                    type: 'object',
                    properties: {
                        id:      { type: 'integer' },
                        name:    { type: 'string' },
                        version: { type: 'integer' }
                    }
                },
                game: {
                    type: 'object',
                    properties: {
                        id:   { type: 'integer' },
                        name: { type: 'string' }
                    }
                },
                server: {
                    type: 'object',
                    properties: {
                        id:   { type: 'integer' },
                        type: { type: 'string' },
                        size: { type: 'integer' }
                    }
                },
                geo: {
                    type: 'object',
                    properties: {
                        user_agent:  { type: 'object' },
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
                    }
                }
            }
        }
    }
}

async function verifyType(schema, value) {
    // Check if the type is an array
    if (Array.isArray(value)) {
        return propertySchema.type === 'array'; // Currently only supporting array type check
    }

    // Type check for other types
    const type = typeof value;
    if (propertySchema.type === 'integer') {
        return Number.isInteger(value);
    } else if (propertySchema.type === 'number') {
        return type === 'number' && !Number.isNaN(value);
    } else {
        return type === propertySchema.type; // For string, boolean, object
    }
}

async function verifyData(schema, json_data) {
    if (typeof json_data !== 'object' || json_data === null) {
        return false; // Must be an object
    }

    // Check if # child elements match # properties
    if (Object.keys(json_data).length != Object.keys(schema.properties).length) {
        return false;
    }

    // Loop through all children in current level
    for (const key in schema.properties) {
        const propertySchema = schema.properties[key];

        const value = json_data[key];
        const isValidType = verifyType(propertySchema, value);
        if (!isValidType) {
            return false; // Type mismatch
        }

        // Recurse deeping on objects
        if (propertySchema.type === 'object') {
            const result = await verifyData(propertySchema, value);
            if (!result) {
                return false; // Nested validation failed
            }
        }
    }

    return true; // All tests passed
}

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
    const success = verifyData(dataSchema, data);
    if (!success) {
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
