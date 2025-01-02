const experiencesService = require('@services/experiences.services'); 
const placesService = require('@services/places.services'); 
const serversService = require('@services/servers.services'); 

async function getServers(req, res) {
    return res.status(501).json({ message: 'Route not implemented' });
}

async function openServer(req, res) {
    const { server_id, place_id, name } = req.body;
    if (!server_id || !place_id || !name) {
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Missing server_id, place_id, or name'
            }
        });
    }

    // Check if the server already exists
    const server = await serversService.getServerById(server_id);
    if (server) {
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Server already exists'
            }
        });
    }

    await serversService.createServer(server_id, place_id, name);

    console.log(`Server ${server_id} opened`);

    return res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            message: 'Server successfully opened'
        }
    });
}

async function closeServer(req, res) {
    const { server_id } = req.body;
    if (!server_id) {
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Missing server_id'
            }
        });
    }

    // Get the server by id
    const server = await serversService.getServerById(server_id);
    // Get the place by server id
    const place = await placesService.getPlaceById(server?.place_id);
    // Get the experience by place id
    const experience = await experiencesService.getExperienceById(place?.experience_id);

    // Check if the user is the owner of the experience
    if (experience.user_id !== req.user.id) {
        return res.status(401).json({
            code: 401,
            status: 'error',
            data: {
                message: 'Unauthorized'
            }
        });
    }

    await serversService.deleteServer(server_id);

    console.log(`Server ${server_id} closed`);

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