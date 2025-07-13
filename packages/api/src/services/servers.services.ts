import db from '@services/sqlite.services';
import logger from '@services/logger.services';

interface Server {
    server_id: number;
    roblox_server_id: string;
    place_id: number;
    name: string;
    active?: boolean;
    [key: string]: any;
}

function createServer(roblox_server_id: string, place_id: number, name: string): number {
    const query = `INSERT INTO servers (roblox_server_id, place_id, name) VALUES (?, ?, ?)`;
    const result = db.prepare(query).run(roblox_server_id, place_id, name);
    logger.info(`Server '${name}' created with Roblox Server ID ${roblox_server_id} and Place ID ${place_id}`);
    return Number(result.lastInsertRowid);
}

function deleteServer(server_id: number): boolean {
    const query = `DELETE FROM servers WHERE server_id = ?`;
    const result = db.prepare(query).run(server_id);

    if (result.changes > 0) {
        logger.info(`Server ID ${server_id} deleted`);
    } else {
        logger.warn(`Attempted to delete non-existent server with ID ${server_id}`);
    }

    return result.changes != 0;
}

function updateServer(
    server_id: number,
    { name, active }: { name?: string; active?: boolean }
): void {
    const updates = [];
    const values = [];
    
    if (name !== undefined) {
        updates.push(`name = ?`);
        values.push(name);
    }
    
    if (active !== undefined) {
        updates.push(`active = ?`);
        values.push(active ? 1 : 0);
    }
    
    if (updates.length === 0) {
        logger.warn(`No updates provided for server ID ${server_id}`);
        return
    };
    
    const query = `UPDATE servers SET ${updates.join(', ')} WHERE server_id = ?`;
    values.push(server_id);
    db.prepare(query).run(...values);
    logger.info(`Server with ID ${server_id} updated with fields: [${updates.map(u => u.split(' ')[0]).join(', ')}]`);
}

function getServerById(server_id: number): Server | undefined {
    const query = `SELECT * FROM servers WHERE server_id = ?`;
    const server: Server = db.prepare(query).get(server_id) as Server;
    
    if (server) {
        logger.info(`Fetched server with ID ${server_id}`);
    } else {
        logger.warn(`No server found with ID ${server_id}`);
    }

    return server;
}

function getServerByRobloxServerIdAndPlaceId(roblox_server_id: string, place_id: number): Server | undefined {
    const query = `SELECT * FROM servers WHERE roblox_server_id = ? AND place_id = ?`;
    const server: Server = db.prepare(query).get(roblox_server_id, place_id) as Server;

    if (server) {
        logger.info(`Fetched server with Roblox Server ID ${roblox_server_id} and Place ID ${place_id}`);
    } else {
        logger.warn(`No server found with Roblox Server ID ${roblox_server_id} and Place ID ${place_id}`);
    }

    return server;
}

function getServersByPlaceId(place_id: number, limit: number = 10): Server[] {
    const query = `SELECT * FROM servers WHERE place_id = ? LIMIT ?`;
    const servers: Server[] = db.prepare(query).all(place_id, limit) as Server[];

    logger.info(`Fetched ${servers.length} server(s) for Place ID ${place_id} with limit ${limit}`);

    return servers;
}

const serversService = {
    createServer,
    deleteServer,
    updateServer,
    getServerById,
    getServerByRobloxServerIdAndPlaceId,
    getServersByPlaceId
};

export default serversService;