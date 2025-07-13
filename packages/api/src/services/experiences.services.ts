import db from '@services/sqlite.services';
import logger from '@services/logger.services';

interface Experience {
    experience_id: number;
    roblox_experience_id: string;
    user_id: number;
    name: string;
    description: string;
    page_link: string;
    thumbnail_link: string;
}

function createExperience(
    roblox_experience_id: string,
    user_id: number,
    name: string,
    description: string,
    page_link: string,
    thumbnail_link: string
): number {
    const query = `INSERT INTO experiences (roblox_experience_id, user_id, name, description, page_link, thumbnail_link) VALUES (?, ?, ?, ?, ?, ?)`;
    const stmt = db.prepare(query);
    const result = stmt.run(
        roblox_experience_id,
        user_id,
        name.substring(0, 50),
        description.substring(0, 1000),
        page_link,
        thumbnail_link
    );
    logger.info(`Experience '${name}' created for user ID ${user_id} with Roblox Experience ID ${roblox_experience_id}`);
    return result.lastInsertRowid as number;
}

function deleteExperience(experience_id: number): boolean {
    const query = `DELETE FROM experiences WHERE experience_id = ?`;
    const stmt = db.prepare(query);
    const result = stmt.run(experience_id);

    if (result.changes > 0) {
        logger.info(`Experience with ID ${experience_id} deleted`);
    } else {
        logger.warn(`Attempted to delete non-existent experience with ID ${experience_id}`);
    }

    return result.changes !== 0;
}

function updateExperience(
    experience_id: number,
    { name, description, page_link, thumbnail_link }: { name?: string; description?: string; page_link?: string; thumbnail_link?: string }
): number {
    const fields: string[] = [];
    const values: any[] = [];
    
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
        logger.warn(`No updates provided for experience ID ${experience_id}`);
        return 0; // No updates to make
    }
    
    const query = `UPDATE experiences SET ${fields.join(', ')} WHERE experience_id = ?`;
    values.push(experience_id);
    
    const stmt = db.prepare(query);
    const result = stmt.run(...values);
    logger.info(`Experience with ID ${experience_id} updated with fields: [${fields.map(f => f.split(' ')[0]).join(', ')}]`);
    return result.changes as number;
}

function getExperienceById(experience_id: number): Experience | undefined {
    const query = `SELECT * FROM experiences WHERE experience_id = ?`;
    const stmt = db.prepare(query);
    const experience = stmt.get(experience_id) as Experience | undefined;

    if (experience) {
        logger.info(`Fetched experience with ID ${experience_id}`);
    } else {
        logger.warn(`No experience found with ID ${experience_id}`);
    }

    return experience;
}

function getExperiencesByUserId(user_id: number, limit: number = 10): Experience[] {
    const query = `SELECT * FROM experiences WHERE user_id = ? LIMIT ?`;
    const stmt = db.prepare(query);
    const experiences = stmt.all(user_id, limit) as Experience[];

    logger.info(`Fetched ${experiences.length} experience(s) for user ID ${user_id} with limit ${limit}`);
    return experiences;
}

function getExperienceCountByUserId(user_id: number): number {
    const query = `SELECT COUNT(*) AS count FROM experiences WHERE user_id = ?`;
    const stmt = db.prepare(query);
    const count = (stmt.get(user_id) as { count: number }).count;

    logger.info(`Fetched experience count (${count}) for user ID ${user_id}`);
    return count;
}

const experiencesService = {
    createExperience,
    deleteExperience,
    updateExperience,
    getExperienceById,
    getExperiencesByUserId,
    getExperienceCountByUserId
};

export default experiencesService;