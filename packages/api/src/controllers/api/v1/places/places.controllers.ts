import { OK } from "@lib/api-response";
import { Request, Response } from "express";
import placesService from '@services/places.services'; 

function getPlaces(req: Request, res: Response) {
    const { experience_id } = req.query;

    const places = placesService.getPlacesByExperienceId(experience_id);

    return res.status(200).json(OK('Places successfully retrieved', { places }));
}

export default {
    getPlaces
}