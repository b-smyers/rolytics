import { Request, Response } from "express";
import robloxService from "@services/roblox.services";

async function getPlaceDetails(req: Request, res: Response) {
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
        const experienceId: string | number = await robloxService.getExperienceIdfromPlaceId(placeId)
            .catch((error: any) => {
                console.error(error);
                return res.status(404).json({
                    code: 404,
                    status: 'error',
                    data: { message: 'Experience not found' }
                });
            });

        if (res.headersSent) return;

        // Step 2: Get Name and Description
        const details: any = await robloxService.getExperienceDetails(experienceId)
            .catch((error: any) => {
                console.error(error);
                return res.status(404).json({
                    code: 404,
                    status: 'error',
                    data: { message: 'Experience details not found' }
                });
            });

        if (res.headersSent) return;

        // Step 3: Get thumbnails (media) for the Universe ID
        const media: any = await robloxService.getExperienceMedia(experienceId)
            .catch((error: any) => {
                console.error(error);
                return res.status(404).json({
                    code: 404,
                    status: 'error',
                    data: { message: 'Experience media not found' }
                });
            });

        if (res.headersSent) return;

        const imageIds: (string | number)[] = media.data.map((item: any) => item.imageId);

        // Step 4: Get the actual image URLs from the CDN
        let imageUrls: string[];
        try {
            imageUrls = await robloxService.getMediaThumbnails(experienceId, imageIds);
        } catch (error) {
            console.error(error);
            return res.status(404).json({
                code: 404,
                status: 'error',
                data: { message: 'Experience images not found' }
            });
        }

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
    } catch (error: any) {
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

const robloxController = {
    getPlaceDetails
};

export default robloxController;
