import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as path from 'path';
import * as fs from 'fs';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logLevel = configService.get<string>('LOG_LEVEL', 'info');
        const logFilePath = configService.get<string>('LOG_FILE_PATH', 'logs/app.log');
        
        // Ensure log directory exists
        const logDir = path.dirname(logFilePath);
        if (!fs.existsSync(logDir)) {
          fs.mkdirSync(logDir, { recursive: true });
        }
        
        // Ensure we have write permissions to the log directory
        try {
          fs.accessSync(logDir, fs.constants.W_OK);
        } catch (error) {
          fs.chmodSync(logDir, 0o755);
        }

        return {
          level: logLevel,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.json()
          ),
          transports: [
            new winston.transports.Console({
              level: logLevel,
              format: winston.format.combine(
                winston.format.colorize(),
                nestWinstonModuleUtilities.format.nestLike(),
              ),
            }),
            new winston.transports.File({
              level: logLevel,
              dirname: logDir,
              filename: path.basename(logFilePath),
              maxsize: 10 * 1024 * 1024, // 10MB
              maxFiles: 5,
              tailable: true,
              zippedArchive: true,
              format: winston.format.combine(
                winston.format.uncolorize(),
                winston.format.json()
              ),
            }),
            new winston.transports.File({
              level: 'error',
              dirname: logDir,
              filename: 'error.log',
              maxsize: 10 * 1024 * 1024, // 10MB
              maxFiles: 5,
              format: winston.format.combine(
                winston.format.uncolorize(),
                winston.format.json()
              ),
            })
          ],
          exitOnError: false,
          handleExceptions: true,
          handleRejections: true,
        };
      },
    }),
  ],
  exports: [WinstonModule],
})
export class LoggingModule {}