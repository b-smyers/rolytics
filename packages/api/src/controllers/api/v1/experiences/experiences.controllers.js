const experiencesdb = require('@services/experiences.services'); 

async function getExperiences(req, res) {
    const userId = req?.user?.id || false;
    if (!userId) {
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Unauthorized'
            }
        });
    }

    const rows = await experiencesdb.getExperiencesByUserId(userId);

    return res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            message: 'Experiences successfully retrieved',
            experiences: rows
        }
    })
}

async function connectExperience(req, res) {
    let { 
        experience_id, 
        page_link, 
        thumbnail_link, 
        name, 
        description
    } = req.body;

    if (!experience_id || !page_link || !name) {
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Missing experience_id, page_link, or name'
            }
        });
    }

    description = description || "";
    thumbnail_link = thumbnail_link || "";

    const userId = req?.user?.id || false;

    if (!userId) {
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Unauthorized'
            }
        });
    }
    
    // Check account experience cap
    const experienceCount = await experiencesdb.getExperienceCountByUserId(userId);
    
    if (experienceCount >= 5) { // TODO: Arbitrary limit for now
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Experience connection limit reached'
            }
        });
    }

    // Check for pre-existing experience
    const existingExperiences = await experiencesdb.getExperiencesByUserId(userId);
    // Make sure experience_id is not in existingExperiences
    const hasExistingExperience = existingExperiences.some(experience => experience.id === experience_id);
    
    if (hasExistingExperience) {
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Experience already connected'
            }
        });
    }

    await experiencesdb.createExperience(experience_id, userId, name, description, page_link, thumbnail_link);

    return res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            message: 'Experience successfully connected'
        }
    })
}

async function disconnectExperience(req, res) {
    return res.status(501).json({ message: 'Route not implemented' });
}

module.exports = {
    getExperiences,
    connectExperience,
    disconnectExperience,
}