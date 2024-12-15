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
    return res.status(501).json({ message: 'Route not implemented' }); 
}

async function disconnectExperience(req, res) {
    return res.status(501).json({ message: 'Route not implemented' });
}

module.exports = {
    getExperiences,
    connectExperience,
    disconnectExperience,
}