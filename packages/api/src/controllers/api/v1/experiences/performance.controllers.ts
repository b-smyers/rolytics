import { BadRequest, OK, Unauthorized } from "@lib/api-response";
import { Request, Response } from "express";
import experiencesService from "@services/experiences.services";
import placesService from "@services/places.services";
import metricsService from "@services/metrics.services";

function getPerformance(req: Request, res: Response) {
  if (!req.user?.id) {
    return res.status(401).json(Unauthorized());
  }

  const params = req.query;
  const experience_id: number = Number(params.experience_id);

  if (!experience_id) {
    return res.status(400).json(BadRequest("Missing experience ID"));
  }

  // Check if the user owns the experience
  let experience = experiencesService.getExperienceById(experience_id);

  if (experience?.user_id !== req.user.id) {
    return res.status(401).json(Unauthorized());
  }

  // If the data is stale, recompute it
  const EXPERIENCE_STALE_TIME_MS = Number(
    process.env.EXPERIENCE_STALE_TIME ?? 0,
  );
  if (Number.isNaN(EXPERIENCE_STALE_TIME_MS)) {
    throw new Error(
      "EXPERIENCE_STALE_TIME must be a valid number in milliseconds",
    );
  }

  const PLACE_STALE_TIME_MS = Number(process.env.PLACE_STALE_TIME ?? 0);
  if (Number.isNaN(PLACE_STALE_TIME_MS)) {
    throw new Error("PLACE_STALE_TIME must be a valid number in milliseconds");
  }

  const lastComputedAt = new Date(experience.last_computed_at);
  const isExperienceStale =
    lastComputedAt < new Date(Date.now() - EXPERIENCE_STALE_TIME_MS);
  if (isExperienceStale) {
    // Check if any of the places are stale
    const places = placesService.getPlacesByExperienceId(experience_id);
    if (places) {
      // Re-aggregate place if stale
      for (const place of places) {
        const lastComputedAt = new Date(place.last_computed_at);
        const isPlaceStale =
          lastComputedAt < new Date(Date.now() - PLACE_STALE_TIME_MS);
        if (isPlaceStale) {
          metricsService.aggregatePlaceMetrics(place.place_id);
        }
      }
    }
    metricsService.aggregateExperienceMetrics(experience_id);
  }

  experience = experiencesService.getExperienceById(experience_id);
  const performance = JSON.parse(experience!.performance);

  // Get keys (exclude "timestamp")
  const keys =
    performance && performance[0]
      ? Object.keys(performance[0]).filter((key) => key !== "timestamp")
      : [];

  return res
    .status(200)
    .json(
      OK("Performance data successfully retrieved", {
        keys,
        data: performance,
      }),
    );
}

export default {
  getPerformance,
};
