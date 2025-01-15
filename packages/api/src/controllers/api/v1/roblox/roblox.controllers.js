const axios = require("axios");
const robloxService = require("@services/roblox.services");

async function getPlaceDetails(req, res) {
    const { placeId } = req.body;

    if (!placeId) {
        return res.status(400).json({
            code: 400,
            status: 'error',
            data: {
                message: 'Missing placeId'
            }
        });
    }

    try {
        // Step 1: Get Experience ID from the Place ID
        const experienceId = await robloxService.getExperienceIdfromPlaceId(placeId)
            .catch(error => {
                console.error(error);
                return res.status(404).json({
                    code: 404,
                    status: 'error',
                    data: { message: 'Experience not found' }
                });
            });


        // Step 2: Get Name and Description
        const details = await robloxService.getExperienceDetails(experienceId)
            .catch(error => {
                console.error(error);
                return res.status(404).json({
                    code: 404,
                    status: 'error',
                    data: { message: 'Experience details not found' }
                });
            });

        // Step 3: Get thumbnails (media) for the Universe ID
        const media = await robloxService.getExperienceMedia(experienceId)
            .catch(error => {
                console.error(error);
                return res.status(404).json({
                    code: 404,
                    status: 'error',
                    data: { message: 'Experience media not found' }
                });
            });

        const imageIds = media.data.map(item => item.imageId);

        // Step 4: Get the actual image URLs from the CDN
        const imageUrls = await robloxService.getMediaThumbnails(experienceId, imageIds)
            .catch(error => {
                console.error(error);
                return res.status(404).json({
                    code: 404,
                    status: 'error',
                    data: { message: 'Experience images not found' }
                });
            });

        // Step 5: Send the response back to the frontend
        return res.json({
            code: 200,
            status: 'success',
            data: {
                placeId: placeId,
                name: details.name,
                description: details.description,
                experienceId: experienceId,
                thumbnails: imageUrls
            }
        });
    } catch (error) {
        console.error("Unexpected error:", {
            message: error.message,
            stack: error.stack
        });
        return res.status(500).json({
            code: 500,
            status: 'error',
            data: { message: 'Internal Server Error' }
        });
    }
}

module.exports = {
    getPlaceDetails
};
