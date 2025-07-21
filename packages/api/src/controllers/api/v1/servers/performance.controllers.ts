import { BadRequest, NotFound, OK, Unauthorized } from "@lib/api-response";
import { Request, Response } from "express";
import experiencesService from "@services/experiences.services";
import placesService from "@services/places.services";
import serversService from "@services/servers.services";
import metricsService from "@services/metrics.services";

function getPerformance(req: Request, res: Response) {
  if (!req.user?.id) {
    return res.status(401).json(Unauthorized());
  }

  const params = req.query;
  const server_id: number = Number(params.server_id);

  if (!server_id) {
    return res.status(400).json(BadRequest("Missing server ID"));
  }

  // Check if the user owns the server
  const server = serversService.getServerById(server_id);

  if (!server) {
    return res.status(404).json(NotFound());
  }

  const place = placesService.getPlaceById(server.place_id);

  if (!place) {
    return res.status(404).json(NotFound());
  }

  const experience = experiencesService.getExperienceById(place.experience_id);

  if (!experience) {
    return res.status(404).json(NotFound());
  }
  if (experience.user_id !== req.user.id) {
    return res.status(401).json(Unauthorized());
  }

  const performance = metricsService.getPerformanceMetricsByServerId(
    server.server_id,
  );

  if (!performance) {
    return res.status(404).json(NotFound());
  }

  // Create list of keys
  const keys = performance && performance[0] ? Object.keys(performance[0]) : [];

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
