import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './logging.config';

@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
  ],
  exports: [WinstonModule],
})
export class LoggingModule {}