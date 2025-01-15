const getDatabase = require('@services/sqlite.services');
let db;
(async function() { db = await getDatabase() })()

async function createExperience(roblox_experience_id, user_id, name, description, page_link, thumbnail_link) {
    const query = `INSERT INTO experiences (roblox_experience_id, user_id, name, description, page_link, thumbnail_link) VALUES (?, ?, ?, ?, ?, ?)`;
    return new Promise((resolve, reject) => {
        db.run(query, [
            roblox_experience_id,
            user_id,
            name.substring(0, 50),
            description.substring(0, 1000),
            page_link, thumbnail_link
        ], function (error) {
            if (error) {
                console.error(`An error occured creating experience: ${error.message}`);
                reject(error);
            }
            console.log(`Experience ${name} created`);
            resolve(this.lastID);
        });
    });
}

async function deleteExperience(experience_id) {
    const query = `DELETE FROM experiences WHERE experience_id = ?`;
    return new Promise((resolve, reject) => {
        db.run(query, [experience_id], function (error) {
            if (error) {
                console.error(`An error occured deleting experience: ${error.message}`);
                reject(error);
            }
            console.log(`Experience deleted`);
            resolve();
        });
    });
}

async function updateExperience(experience_id, { name, description, page_link, thumbnail_link }) {
    const values = [];
    let query = `UPDATE experiences SET`;

    if (name !== undefined) {
        query += ` name = ?`;
        values.push(name);
    }

    if (description !== undefined) {
        query += ` description = ?`;
        values.push(description);
    }

    if (page_link !== undefined) {
        query += ` page_link = ?`;
        values.push(page_link);
    }

    if (thumbnail_link !== undefined) {
        query += ` thumbnail_link = ?`;
        values.push(thumbnail_link);
    }
    
    query += "WHERE experience_id = ?";
    values.push(experience_id);

    return new Promise((resolve, reject) => {
        db.run(query, [
            name.substring(0, 50),
            description.substring(0, 1000), 
            page_link, 
            thumbnail_link, 
            experience_id
        ], function (error) {
            if (error) {
                console.error(`An error occured updating experience: ${error.message}`);
                reject(error);
            }
            console.log(`Experience updated`);
            resolve();
        });
    });
}

async function getExperienceById(experience_id) {
    const query = `SELECT experience_id, roblox_experience_id, user_id, name, description, page_link, thumbnail_link, created_at, purchases, performance, social, players, metadata, last_computed_at FROM experiences WHERE experience_id = ?`;
    return new Promise((resolve, reject) => {
        db.get(query, [experience_id], function (error, row) {
            if (error) {
                console.error(`An error occured getting experience: ${error.message}`);
                reject(error);
            }
            resolve(row);
        });
    });
}

async function getExperiencesByUserId(user_id, limit = 10) {
    const query = `SELECT experience_id, roblox_experience_id, user_id, name, description, page_link, thumbnail_link, created_at, purchases, performance, social, players, metadata, last_computed_at FROM experiences WHERE user_id = ? LIMIT ${limit}`;
    return new Promise((resolve, reject) => {
        db.all(query, [user_id], function (error, rows) {
            if (error) {
                console.error(`An error occured getting experiences: ${error.message}`);
                reject(error);
            }
            resolve(rows);
        });
    });
}

async function getExperienceCountByUserId(user_id) {
    const query = `SELECT COUNT(*) AS count FROM experiences WHERE user_id = ?`;
    return new Promise((resolve, reject) => {
        db.get(query, [user_id], function (error, row) {
            if (error) {
                console.error(`An error occured getting user's experience count: ${error.message}`);
                reject(error);
            }
            resolve(row.count);
        });
    });
}

module.exports = {
    createExperience,
    deleteExperience,
    updateExperience,
    getExperienceById,
    getExperiencesByUserId,
    getExperienceCountByUserId
}