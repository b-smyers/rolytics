const axios = require('axios');
const logger = require('@services/logger.services');

const client = axios.create({
    timeout: 1500,
    headers: {
        'Content-Type': 'application/json'
    }
})

async function getMediaThumbnails(experienceId, imageIds) {
    if (imageIds.length === 0) { 
        logger.warn(`getMediaThumbnails: Empty imageIds array provided for experienceId ${experienceId}`);
        return []; 
    }
    // DOCS: https://thumbnails.roblox.com//docs/index.html
    const imageSize = '768x432'; // 768x432, 576x324, 480x270, 384x216, 256x144
    const url = `https://thumbnails.roblox.com/v1/games/${experienceId}/thumbnails`;

    try {
        const response = await client.get(url, {
            params: {
                thumbnailIds: imageIds,
                size: imageSize,
                format: 'png'
            }
        });
        logger.info(`Fetched media thumbnails for experienceId ${experienceId} with ${imageIds.length} thumbnailIds`);
        return response.data?.data.map(thumbnail => thumbnail.imageUrl);
    } catch (error) {
        logger.error(`getMediaThumbnails: Error fetching thumbnails for experienceId ${experienceId} - ${error.message}`);
        return [];
    }
}

async function getExperienceMedia(experienceId) {
    // DOCS: https://games.roblox.com//docs/index.html
    const url = `https://games.roblox.com/v2/games/${experienceId}/media`;

    try {
        const response = await client.get(url);
        logger.info(`Fetched experience media for experienceId ${experienceId}`);
        return response.data;
    } catch (error) {
        logger.error(`getExperienceMedia: Error fetching media for experienceId ${experienceId} - ${error.message}`);
        throw error;
    }
}

async function getExperienceDetails(experienceId) {
    // DOCS: https://develop.roblox.com//docs/index.html
    const url = `https://develop.roblox.com/v1/universes/${experienceId}`;

    try {
        const response = await client.get(url);
        logger.info(`Fetched experience details for experienceId ${experienceId}`);
        return response.data;
    } catch (error) {
        logger.error(`getExperienceDetails: Error fetching details for experienceId ${experienceId} - ${error.message}`);
        throw error;
    }
}

async function getExperienceIdfromPlaceId(placeId) {
    // DOCS: 
    const url = `https://apis.roblox.com/universes/v1/places/${placeId}/universe`;

    try {
        const response = await client.get(url);
        logger.info(`Fetched universeId from placeId ${placeId}`);
        return response.data.universeId;
    } catch (error) {
        logger.error(`getExperienceIdfromPlaceId: Error fetching universeId for placeId ${placeId} - ${error.message}`);
        throw error;
    }
}

async function getPlacesByRobloxExperienceId(experienceId) {
    // DOCS: https://develop.roblox.com//docs/index.html?urls.primaryName=Develop%20Api%20v1
    const url = `https://develop.roblox.com/v1/universes/${experienceId}/places`;

    try {
        const response = await client.get(url);
        logger.info(`Fetched places for experienceId ${experienceId} with ${response.data.data.length} place(s)`);
        return response.data.data;
    } catch (error) {
        logger.error(`getPlacesByRobloxExperienceId: Error fetching places for experienceId ${experienceId} - ${error.message}`);
        throw error;
    }
}

module.exports = {
    getMediaThumbnails,
    getExperienceMedia,
    getExperienceDetails,
    getExperienceIdfromPlaceId,
    getPlacesByRobloxExperienceId
}
