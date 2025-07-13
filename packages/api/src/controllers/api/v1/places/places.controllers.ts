import { Request, Response } from "express";

const placesService = require('@services/places.services'); 

function getPlaces(req: Request, res: Response) {
    const { experience_id } = req.query;

    const rows = placesService.getPlacesByExperienceId(experience_id);

    return res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            message: 'Places successfully retrieved',
            places: rows
        }
    })
}

const placesController = {
    getPlaces
}

export default placesController;