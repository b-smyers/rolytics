import path from 'path';
import fs from 'fs';

const logFilePath = path.resolve(__dirname, '../../logs/logs.log');

const logsDir = path.dirname(logFilePath);
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

function getTimestamp(): string {
    const now = new Date();
    return now.toISOString()
        .replace(/T/, '-') // replace T with -
        .replace(/\..+/, match => match.slice(0, 4)); // keep ms only (3 digits)
}

function getCallInfo() {
    const originalPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack) => stack;
    const err = new Error();
    const stack = err.stack as unknown as NodeJS.CallSite[];
    Error.prepareStackTrace = originalPrepareStackTrace;

    const caller = stack[3];
    const functionName = caller ? (caller.getFunctionName?.() || caller.getMethodName?.()) || '<anonymous>' : '<unknown>';
    const filePath = caller?.getFileName?.() || '<unknown>';
    const fileName = path.basename(filePath);
    const lineNumber = caller?.getLineNumber?.() || '<unknown>';

    return {
        "function": functionName,
        "file": fileName,
        "line": lineNumber
    };
}

function shouldLog(level: string): boolean {
    const logLevel = process.env.LOG_LEVEL as keyof typeof levels;
    const levels: Record<string, number> = {
        'error': 0,
        'warn': 1,
        'info': 2,
        'debug': 3
    };
    return levels[level] <= levels[logLevel];
}

function log(level: string, message: string): void {
    const timestamp = getTimestamp();
    const info = getCallInfo();

    const logMessage = `[${timestamp}] ${level.toUpperCase()} [${info.function}@${info.file}:${info.line}]: ${message}\n`;

    const nodeEnv = process.env.NODE_ENV;
    if (nodeEnv === 'development' || nodeEnv === 'test') {
        if (shouldLog(level)) {
            console.log(logMessage.trim());
        }
    } else {
        try {
            fs.appendFileSync(logFilePath, logMessage);
        } catch (err: any) {
            // Fallback to console if file writing fails
            console.error(`Failed to write log to file: ${err.message}`);
            console.log(logMessage.trim());
        }
    }
}

const logger = {
    info: (message: string) => log('info', message),
    warn: (message: string) => log('warn', message),
    error: (message: string) => log('error', message),
    debug: (message: string) => log('debug', message)
};

export default logger;