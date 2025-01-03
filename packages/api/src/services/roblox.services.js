const axios = require('axios');

async function getPlacesByRobloxExperienceId(id) {
    // https://develop.roblox.com//docs/index.html?urls.primaryName=Develop%20Api%20v1
    const url = `https://develop.roblox.com/v1/universes/${id}/places`;

    try {
        const response = await axios.get(url, {
            headers: {
                'accept': 'application/json'
            }
        });

        return response.data.data;
    } catch (error) {
        console.error(`An error occured fetching places by experience id: ${error.message}`);
    }
}

module.exports = {
    getPlacesByRobloxExperienceId
}