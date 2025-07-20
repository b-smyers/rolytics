import { NotFound, OK } from "@lib/api-response";
import { Request, Response } from "express";
import placesService from '@services/places.services'; 

function getPlaces(req: Request, res: Response) {
    const params = req.query;
    const experience_id: number = Number(params.experience_id);
    
    const places = placesService.getPlacesByExperienceId(experience_id);

        if (!places) {
            return res.status(404).json(NotFound());
        }

    return res.status(200).json(OK('Places successfully retrieved', { places }));
}

export default {
    getPlaces
}