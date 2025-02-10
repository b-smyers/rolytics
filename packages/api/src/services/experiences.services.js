const db = require('@services/sqlite.services');

function createExperience(roblox_experience_id, user_id, name, description, page_link, thumbnail_link) {
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
    console.log(`Experience ${name} created`);
    return result.lastInsertRowid;
}

function deleteExperience(experience_id) {
    const query = `DELETE FROM experiences WHERE experience_id = ?`;
    const stmt = db.prepare(query);
    const result = stmt.run(experience_id);
    console.log(`Deleted ${result.changes} rows.`);
    return result.changes != 0;
}

function updateExperience(experience_id, { name, description, page_link, thumbnail_link }) {
    const fields = [];
    const values = [];
    
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
    
    if (fields.length === 0) return 0; // No updates to make
    
    const query = `UPDATE experiences SET ${fields.join(', ')} WHERE experience_id = ?`;
    values.push(experience_id);
    
    const stmt = db.prepare(query);
    const result = stmt.run(...values);
    console.log(`Experience updated`);
    return result.changes;
}

function getExperienceById(experience_id) {
    const query = `SELECT * FROM experiences WHERE experience_id = ?`;
    const stmt = db.prepare(query);
    return stmt.get(experience_id);
}

function getExperiencesByUserId(user_id, limit = 10) {
    const query = `SELECT * FROM experiences WHERE user_id = ? LIMIT ?`;
    const stmt = db.prepare(query);
    return stmt.all(user_id, limit);
}

function getExperienceCountByUserId(user_id) {
    const query = `SELECT COUNT(*) AS count FROM experiences WHERE user_id = ?`;
    const stmt = db.prepare(query);
    return stmt.get(user_id).count;
}

module.exports = {
    createExperience,
    deleteExperience,
    updateExperience,
    getExperienceById,
    getExperiencesByUserId,
    getExperienceCountByUserId
};