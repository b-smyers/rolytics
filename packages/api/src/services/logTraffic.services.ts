import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";

const logsDirectory = path.join(__dirname, "../../logs");
const trafficCsv = path.join(logsDirectory, "traffic.csv");
const trafficLog = path.join(logsDirectory, "traffic.log");

if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory, { recursive: true });
}

if (!fs.existsSync(trafficCsv)) {
  const header =
    "timestamp,client_ip,method,path,status_code,response_time_ms,user_agent\n";
  fs.writeFileSync(trafficCsv, header);
}

function logTraffic(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();

  res.on("finish", () => {
    const timestamp = new Date().toISOString();
    const clientIp = req.headers["x-forwarded-for"] || req.ip;
    const method = req.method;
    const reqPath = req.path;
    const userAgent = req.headers["user-agent"] || "Unknown";
    const statusCode = res.statusCode;
    const responseTime = Date.now() - startTime;

    const row = `"${timestamp}","${clientIp}","${method}","${reqPath}","${statusCode}","${responseTime}","${userAgent}"\n`;

    // Append csv
    fs.appendFile(trafficCsv, row, (err) => {
      if (err) {
        console.error("Failed to write to traffic csv file:", err);
      }
    });

    const log = `[${timestamp}] ${clientIp} ${method} ${statusCode} '${reqPath}' response-time-ms: ${responseTime} user-agent: ${userAgent}\n`;

    // Append log
    fs.appendFile(trafficLog, log, (err) => {
      if (err) {
        console.error("Failed to write to traffic log file:", err);
      }
    });
  });

  next();
}

export default logTraffic;
