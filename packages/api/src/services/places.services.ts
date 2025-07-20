import { DBPlace, Place } from 'types/place';
import db from '@services/sqlite.services';
import logger from '@services/logger.services';

function createPlace(roblox_place_id: string, experience_id: number, name: string): number {
    const query = `INSERT INTO places (roblox_place_id, experience_id, name) VALUES (?, ?, ?)`;
    const result = db.prepare(query).run(roblox_place_id, experience_id, name);
    logger.info(`Place '${name}' created with Roblox Place ID ${roblox_place_id} and Experience ID ${experience_id}`);
    return Number(result.lastInsertRowid);
}

function deletePlace(place_id: number): boolean {
    const query = `DELETE FROM places WHERE place_id = ?`;
    const result = db.prepare(query).run(place_id);

    if (result.changes > 0) {
        logger.info(`Place with ID ${place_id} deleted`);
    } else {
        logger.warn(`Attempted to delete non-existent place with ID ${place_id}`);
    }

    return result.changes != 0;
}

function updatePlace(place_id: number, { name }: { name?: string }): void {
    if (name === undefined) {
        logger.warn(`No update provided for place ID ${place_id}`);
        return;
    }

    const query = `UPDATE places SET name = ? WHERE place_id = ?`;
    const result = db.prepare(query).run(name, place_id);

    if (result.changes > 0) {
        logger.info(`Place with ID ${place_id} updated with new name '${name}'`);
    } else {
        logger.warn(`Attempted to update non-existent place with ID ${place_id}`);
    }
}

function getPlaceById(place_id: number): Place | undefined {
    const query = `SELECT place_id, roblox_place_id, experience_id, name, purchases, performance, social, players, metadata, last_computed_at FROM places WHERE place_id = ?`;
    const place: DBPlace = db.prepare(query).get(place_id) as DBPlace;

    if (place) {
        logger.info(`Fetched place with ID ${place_id}`);
    } else {
        logger.warn(`No place found with ID ${place_id}`);
    }

    return place as Place;
}

function getPlaceByRobloxPlaceId(roblox_place_id: string): Place | undefined {
    const query = `SELECT place_id, roblox_place_id, experience_id, name, purchases, performance, social, players, metadata, last_computed_at FROM places WHERE roblox_place_id = ?`;
    const place: DBPlace = db.prepare(query).get(roblox_place_id) as DBPlace;

    if (place) {
        logger.info(`Fetched place with Roblox Place ID ${roblox_place_id}`);
    } else {
        logger.warn(`No place found with Roblox Place ID ${roblox_place_id}`);
    }

    return place as Place;
}

function getPlacesByExperienceId(experience_id: number, limit: number = 10): Place[] | undefined {
    const query = `SELECT place_id, roblox_place_id, experience_id, name, purchases, performance, social, players, metadata, last_computed_at FROM places WHERE experience_id = ? LIMIT ?`;
    const places: DBPlace[] = db.prepare(query).all(experience_id, limit) as DBPlace[];

    if (places) {
        logger.info(`Fetched ${places.length} place(s) for Experience ID ${experience_id} with limit ${limit}`);
    } else {
        logger.info(`No place(s) for experience ID '${experience_id}' with limit ${limit}`);
    }

    return places as Place[];
}

export default {
    createPlace,
    deletePlace,
    updatePlace,
    getPlaceById,
    getPlaceByRobloxPlaceId,
    getPlacesByExperienceId
};