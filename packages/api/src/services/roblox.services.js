const axios = require('axios');
const client = axios.create({
    timeout: 1500,
    headers: {
        'Content-Type': 'application/json'
    }
})

async function getMediaThumbnails(experienceId, imageIds) {
    if (imageIds.length == 0) { return []; }
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
        return response.data?.data.map(thumbnail => thumbnail.imageUrl);
    } catch (error) {
        console.error(`An error occurred getting thumbnail links: ${error.message}`);
    }
}

async function getExperienceMedia(experienceId) {
    // DOCS: https://games.roblox.com//docs/index.html
    const url = `https://games.roblox.com/v2/games/${experienceId}/media`;

    try {
        const response = await client.get(url);
        return response.data;
    } catch (error) {
        console.error(`An error occurred getting experince media by experience id: ${error.message}`);
        throw error;
    }
}

async function getExperienceDetails(experienceId) {
    // DOCS: https://develop.roblox.com//docs/index.html
    const url = `https://develop.roblox.com/v1/universes/${experienceId}`;

    try {
        const response = await client.get(url);
        return response.data;
    } catch (error) {
        console.error(`An error occurred getting experience details by experience id: ${error.message}`);
        throw error;
    }
}

async function getExperienceIdfromPlaceId(placeId) {
    // DOCS: 
    const url = `https://apis.roblox.com/universes/v1/places/${placeId}/universe`;

    try {
        const response = await client.get(url);
        return response.data.universeId;
    } catch (error) {
        console.error(`An error occurred getting experience id from place id: ${error.message}`);
        throw error;
    }
}

async function getPlacesByRobloxExperienceId(experienceId) {
    // DOCS: https://develop.roblox.com//docs/index.html?urls.primaryName=Develop%20Api%20v1
    const url = `https://develop.roblox.com/v1/universes/${experienceId}/places`;

    try {
        const response = await client.get(url);

        return response.data.data;
    } catch (error) {
        console.error(`An error occurred getting places by experience id: ${error.message}`);
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
