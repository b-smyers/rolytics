const experiencesdb = require('@services/experiences.services'); 

async function getExperiences(req, res) {
    const userId = req.session?.user?.id || false;

    if (!userId) {
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Unauthorized'
            }
        });
    }

    const rows = await experiencesdb.getExperiences(userId);

    return res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            message: 'Experiences successfully retrieved',
            data: rows
        }
    })
}

async function connectExperience(req, res) {
    let { 
        place_id, 
        universe_id, 
        page_link, 
        thumbnail_link, 
        title, 
        description
    } = req.body;

    if (!place_id || !universe_id || !page_link || !title) {
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Missing place_id, universe_id, page_link, or title'
            }
        });
    }

    description = description || "";
    thumbnail_link = thumbnail_link || "";

    const userId = req.session?.user?.id || false;

    if (!userId) {
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Unauthorized'
            }
        });
    }

    const existingExperience = await experiencesdb.findExistingExperience(userId, universe_id);
    
    if (existingExperience) {
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Experience already connected'
            }
        });
    }

    await experiencesdb.connectExperience(userId, universe_id, thumbnail_link, page_link, title, description);

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