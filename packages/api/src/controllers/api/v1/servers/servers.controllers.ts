import { BadRequest, OK, Unauthorized } from "@lib/api-response";
import { Request, Response } from "express";
import experiencesService from '@services/experiences.services';
import placesService from '@services/places.services';
import serversService from '@services/servers.services';
import logger from '@services/logger.services';

function getServers(req: Request, res: Response) {
    if (!req.user?.id) {
        return res.status(401).json(Unauthorized());
    }

    const { place_id } = req.query;

    if (!place_id) {
        return res.status(400).json(BadRequest('Missing experience place_id'));
    }

    const place = placesService.getPlaceById(place_id);

    const experience = experiencesService.getExperienceById(place?.experience_id);
    // Make sure they own the experience
    if (!experience || experience.user_id !== req.user.id) {
        return res.status(401).json(Unauthorized());
    }

    const servers = serversService.getServersByPlaceId(place?.place_id);

    return res.status(200).json(OK('Successfully retrieved servers', { servers }));
}

function openServer(req: Request, res: Response) {
    if (!req.user?.id) {
        return res.status(401).json(Unauthorized());
    }

    const { roblox_server_id, roblox_place_id, name } = req.body;

    if (!roblox_server_id || !roblox_place_id || !name) {
        return res.status(400).json(BadRequest('Missing roblox_server_id, roblox_place_id, or name'));
    }

    const place = placesService.getPlaceByRobloxPlaceId(roblox_place_id);
    // Check if the place exists
    if (!place) {
        return res.status(400).json(BadRequest('Place does not exist'));
    }

    // Check if the server already exists
    const server = serversService.getServerByRobloxServerIdAndPlaceId(roblox_server_id, place.place_id);
    if (server && !server.active) {
        serversService.updateServer(server.server_id, { active: true });
        logger.info(`Server ${server.name}:${server.server_id} reopened`);
        return res.status(200).json(OK('Server successfully reopened'));
    } else if (server && !!server.active) {
        return res.status(400).json(BadRequest('Server already exists'));
    }

    // TODO: Need check to make sure server is part of place

    serversService.createServer(roblox_server_id, place.place_id, name);

    logger.info(`Server ${name} opened`);

    return res.status(200).json(OK('Server successfully opened'));
}

function closeServer(req: Request, res: Response) {
    if (!req.user?.id) {
        return res.status(401).json(Unauthorized());
    }

    const { roblox_server_id, roblox_place_id } = req.body;
    if (!roblox_server_id || !roblox_place_id) {
        return res.status(400).json(BadRequest('Missing roblox_server_id, roblox_place_id, or name'));
    }

    const place = placesService.getPlaceByRobloxPlaceId(roblox_place_id);
    // Get the server by id
    const server = serversService.getServerByRobloxServerIdAndPlaceId(roblox_server_id, place.place_id);
    // Get the experience by place id
    const experience = experiencesService.getExperienceById(place?.experience_id);

    // Check if the user is the owner of the experience
    if (experience?.user_id !== req.user.id) {
        return res.status(401).json(Unauthorized());
    }

    serversService.updateServer(server.server_id, { active: false });

    logger.info(`Server ${server.name}:${server.server_id} closed`);

    return res.status(200).json(OK('Server successfully closed'));
}

export default {
    getServers,
    openServer,
    closeServer
}