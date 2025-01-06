
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger {
  log(message: string, correlationId?: string) {
    super.log(`[CorrelationId: ${correlationId}] ${message}`);
  }

  error(message: string, stack: string, correlationId?: string) {
    super.error(`[CorrelationId: ${correlationId}] ${message}`, stack);
  }

  warn(message: string, correlationId?: string) {
    super.warn(`[CorrelationId: ${correlationId}] ${message}`);
  }
}
