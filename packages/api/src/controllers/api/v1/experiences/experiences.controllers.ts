import {
  BadRequest,
  NotImplemented,
  OK,
  Unauthorized,
} from "@lib/api-response";
import { Request, Response } from "express";
import experiencesService from "@services/experiences.services";
import placesService from "@services/places.services";
import robloxService from "@services/roblox.services";

function getExperiences(req: Request, res: Response) {
  if (!req.user?.id) {
    return res.status(401).json(Unauthorized());
  }

  const experiences = experiencesService.getExperiencesByUserId(req.user.id);
  return res
    .status(200)
    .json(OK("Experiences successfully retrieved", { experiences }));
}

async function connectExperience(req: Request, res: Response) {
  if (!req.user?.id) {
    return res.status(401).json(Unauthorized());
  }

  let { roblox_experience_id, page_link, thumbnail_link, name, description } =
    req.body;

  if (!roblox_experience_id || !page_link || !name) {
    return res
      .status(400)
      .json(BadRequest("Missing roblox_experience_id, page_link, or name"));
  }

  description = description || "";
  thumbnail_link = thumbnail_link || "";

  const userId = req.user.id;

  // Check account experience cap
  const experienceCount = experiencesService.getExperienceCountByUserId(userId);

  if (experienceCount >= 5) {
    // TODO: Arbitrary limit for now
    return res
      .status(400)
      .json(BadRequest("Experience connection limit reached"));
  }

  // Check for pre-existing experience
  const existingExperiences = experiencesService.getExperiencesByUserId(userId);

  // Make sure roblox_experience_id is not in existingExperiences
  const hasExistingExperience = existingExperiences?.some(
    (experience: any) =>
      experience.roblox_experience_id === roblox_experience_id,
  );

  if (hasExistingExperience) {
    return res.status(400).json(BadRequest("Experience already connected"));
  }

  const experience_id = experiencesService.createExperience(
    roblox_experience_id,
    userId,
    name,
    description,
    page_link,
    thumbnail_link,
  );

  // Get places from Roblox API
  const places =
    await robloxService.getPlacesByRobloxExperienceId(roblox_experience_id);
  if (places.length) {
    Promise.all(
      places.map((place: any) => {
        placesService.createPlace(place.id, experience_id, place.name);
      }),
    );
  }

  return res.status(200).json(OK("Experience successfully connected"));
}

function disconnectExperience(req: Request, res: Response) {
  return res.status(501).json(NotImplemented());
}

export default {
  getExperiences,
  connectExperience,
  disconnectExperience,
};
