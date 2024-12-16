const axios = require("axios");

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
        // Step 1: Get Universe ID from the Place ID
        const universeId = await axios.get(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`, {
            headers: { 'accept': 'application/json' }
        }).then(response => response.data.universeId)
          .catch(error => {
            console.error("Error fetching Universe ID:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
            return res.status(404).json({
                code: 404,
                status: 'error',
                data: { message: 'Universe not found' }
            });
        });

        // Step 2: Get Title and Description
        // DOCS: https://develop.roblox.com//docs/index.html
        let title = "";
        let description = "";
        if (universeId) {
            const universeData = await axios.get(`https://develop.roblox.com/v1/universes/${universeId}`, {
                headers: { 'accept': 'application/json' }
            }).then(response => response.data)
            .catch(error => {
                console.error("Error fetching Universe details:", {
                    message: error.message,
                    status: error.response?.status,
                    data: error.response?.data
                });
                return { name: "", description: "" };
            });
            title = universeData.name;
            description = universeData.description;
        }

        // Step 3: Get thumbnails (media) for the Universe ID
        // DOCS: https://games.roblox.com//docs/index.html
        let imageIds = [];
        if (universeId) {
            imageIds = await axios.get(`https://games.roblox.com/v2/games/${universeId}/media`, {
                headers: { 'accept': 'application/json' }
            }).then(response => response.data.data.map(item => item.imageId))
            .catch(error => {
                console.error("Error fetching media:", {
                    message: error.message,
                    status: error.response?.status,
                    data: error.response?.data
                });
                return [];
            });
        };

        // Step 4: Get the actual image URLs from the CDN
        // DOCS: https://thumbnails.roblox.com//docs/index.html
        let imageUrl = [];
        if (imageIds.length > 0) {
            const imageSize = '768x432'; // 768x432, 576x324, 480x270, 384x216, 256x144
            imageUrl = await axios.get(`https://thumbnails.roblox.com/v1/games/${universeId}/thumbnails`, {
                headers: { 'accept': 'application/json' },
                params: {
                    thumbnailIds: imageIds[0], // Get only the first thumbnail
                    size: imageSize,
                    format: 'png'
                }
            }).then(response => response.data.data.map(thumbnail => thumbnail.imageUrl))
              .catch(error => {
                  console.error("Error fetching thumbnails:", {
                      message: error.message,
                      status: error.response?.status,
                      data: error.response?.data
                  });
                  return [];
              });
        };

        // Step 5: Send the response back to the frontend
        return res.json({
            code: 200,
            status: 'success',
            data: {
                placeId,
                title,
                description,
                universeId,
                thumbnails: imageUrl
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
