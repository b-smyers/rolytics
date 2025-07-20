import { DBExperience, Experience } from 'types/experience';
import db from '@services/sqlite.services';
import logger from '@services/logger.services';

function createExperience(
    roblox_experience_id: string,
    user_id: number,
    name: string,
    description: string,
    page_link: string,
    thumbnail_link: string
): number {
    const query = `INSERT INTO experiences (roblox_experience_id, user_id, name, description, page_link, thumbnail_link) VALUES (?, ?, ?, ?, ?, ?)`;
    const result = db.prepare(query).run(
        roblox_experience_id,
        user_id,
        name.substring(0, 50),
        description.substring(0, 1000),
        page_link,
        thumbnail_link
    );
    logger.info(`Experience '${name}' created for user ID '${user_id}' with Roblox Experience ID '${roblox_experience_id}'`);
    return result.lastInsertRowid as number;
}

function deleteExperience(experience_id: number): boolean {
    const query = `DELETE FROM experiences WHERE experience_id = ?`;
    const changes = db.prepare(query).run(experience_id).changes;

    if (changes > 0) {
        logger.info(`Experience with ID '${experience_id}' deleted`);
    } else {
        logger.warn(`Attempted to delete non-existent experience with ID '${experience_id}'`);
    }

    return changes !== 0;
}

function updateExperience(
    experience_id: number,
    { name, description, page_link, thumbnail_link }: { name?: string; description?: string; page_link?: string; thumbnail_link?: string }
): void {
    const fields: string[] = [];
    const values: string[] = [];

    if (name !== undefined) {
        fields.push(`name = ?`);
        values.push(name.substring(0, 50));
    }
    if (description !== undefined) {
        fields.push(`description = ?`);
        values.push(description.substring(0, 1000));
    }
    if (page_link !== undefined) {
        fields.push(`page_link = ?`);
        values.push(page_link);
    }
    if (thumbnail_link !== undefined) {
        fields.push(`thumbnail_link = ?`);
        values.push(thumbnail_link);
    }

    if (fields.length === 0) {
        logger.warn(`No updates provided for experience ID '${experience_id}'`);
        return;
    }

    const query = `UPDATE experiences SET ${fields.join(', ')} WHERE experience_id = ?`;
    values.push(String(experience_id));

    db.prepare(query).run(...values);
    logger.info(`Experience with ID '${experience_id}' updated with fields: [${fields.map(f => f.split(' ')[0]).join(', ')}]`);
}

function getExperienceById(experience_id: number): Experience | undefined {
    const query = `SELECT * FROM experiences WHERE experience_id = ?`;
    const experience = db.prepare(query).get(experience_id) as DBExperience | undefined;

    if (experience) {
        logger.info(`Fetched experience with ID '${experience_id}'`);
    } else {
        logger.warn(` experience found with ID '${experience_id}'`);
    }

    return experience as Experience;
}

function getExperiencesByUserId(user_id: number, limit = 10): Experience[] | undefined {
    const query = `SELECT * FROM experiences WHERE user_id = ? LIMIT ?`;
    const experiences = db.prepare(query).all(user_id, limit) as DBExperience[] | undefined;

    if (experiences) {
        logger.info(`Fetched ${experiences.length} experience(s) for user ID '${user_id}' with limit ${limit}`);
    } else {
        logger.info(`No experience(s) for user ID '${user_id}' with limit ${limit}`);
    }
    
    return experiences as Experience[];
}

function getExperienceCountByUserId(userId: number): number {
    const query = `SELECT COUNT(*) AS count FROM experiences WHERE user_id = ?`;
    const row = db.prepare(query).get(userId) as { count: number };
    const count = row.count;

    logger.info(`Fetched experience count (${count}) for user ID '${userId}'`);
    return count;
}

export default {
    createExperience,
    deleteExperience,
    updateExperience,
    getExperienceById,
    getExperiencesByUserId,
    getExperienceCountByUserId
};