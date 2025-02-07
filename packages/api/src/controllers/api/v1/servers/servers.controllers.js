const experiencesService = require('@services/experiences.services'); 
const placesService = require('@services/places.services'); 
const serversService = require('@services/servers.services'); 

function getServers(req, res) {
    const { place_id } = req.query;

    if (!place_id) {
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Missing experience place_id'
            }
        });
    }

    const place = placesService.getPlaceById(place_id);

    const experience = experiencesService.getExperienceById(place?.experience_id);
    // Make sure they own the experience
    if (!experience || experience.user_id !== req.user.id) {
        return res.status(403).json({
            code: 403,
            status: 'error',
            data: {
                message: 'Unauthorized'
            }
        });
    }

    const servers = serversService.getServersByPlaceId(place?.place_id);

    return res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            message: 'Successfully retrieved servers',
            servers
        }
    });
}

function openServer(req, res) {
    const { roblox_server_id, roblox_place_id, name } = req.body;

    if (!roblox_server_id || !roblox_place_id || !name) {
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Missing roblox_server_id, roblox_place_id, or name'
            }
        });
    }

    // Check if the server already exists
    const server = serversService.getServerByRobloxServerId(roblox_server_id);
    if (server && !server.active) {
        serversService.updateServer(server.server_id, { active: true });
        console.log(`Server ${server.name}:${server.server_id} reopened`);
        return res.status(200).json({
            code: 200,
            status: 'success',
            data: {
                message: 'Server successfully reopened'
            }
        });
    } else if (server && !!server.active) {
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Server already exists'
            }
        });
    }

    // Check if the place exists
    const place = placesService.getPlaceByRobloxPlaceId(roblox_place_id);
    if (!place) {
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Place does not exist'
            }
        });
    }
    
    // TODO: Need check to make sure server is part of place

    serversService.createServer(roblox_server_id, place.place_id, name);

    console.log(`Server ${name} opened`);

    return res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            message: 'Server successfully opened'
        }
    });
}

function closeServer(req, res) {
    const { roblox_server_id } = req.body;
    if (!roblox_server_id) {
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Missing roblox_server_id'
            }
        });
    }

    // Get the server by id
    const server = serversService.getServerByRobloxServerId(roblox_server_id);
    // Get the place by server id
    const place = placesService.getPlaceById(server?.place_id);
    // Get the experience by place id
    const experience = experiencesService.getExperienceById(place?.experience_id);

    // Check if the user is the owner of the experience
    if (experience?.user_id !== req.user.id) {
        return res.status(401).json({
            code: 401,
            status: 'error',
            data: {
                message: 'Unauthorized'
            }
        });
    }

    serversService.updateServer(server.server_id, { active: false });

    console.log(`Server ${server.name}:${server.server_id} closed`);

    return res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            message: 'Server successfully closed'
        }
    });
}

module.exports = {
    getServers,
    openServer,
    closeServer
}