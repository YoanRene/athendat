import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as path from 'path';
import * as fs from 'fs';
import 'winston-daily-rotate-file';

// Asegurarse de que el directorio de logs exista
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Configuración de formato común para los logs
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
);

// Configuración para rotación diaria de archivos
const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logDir, 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: logFormat,
});

// Configuración para logs de error con rotación
const errorFileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logDir, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'error',
  format: logFormat,
});

// Configuración para la consola
const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.ms(),
    nestWinstonModuleUtilities.format.nestLike(),
  ),
});

export const winstonConfig = {
  transports: [
    consoleTransport,
    dailyRotateFileTransport,
    errorFileTransport,
  ],
};