type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = !import.meta.env.PROD;
  }

  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, context } = entry;
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${
      context ? ' | ' + JSON.stringify(context) : ''
    }`;
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error
    };

    if (this.isDevelopment) {
      const formattedLog = this.formatLog(entry);

      switch (level) {
        case 'error':
          console.error(formattedLog, error || '');
          break;
        case 'warn':
          console.warn(formattedLog);
          break;
        case 'debug':
          console.debug(formattedLog);
          break;
        default:
          console.log(formattedLog);
      }
    }

    if (import.meta.env.PROD && level === 'error') {
      this.sendToMonitoring(entry);
    }
  }

  private sendToMonitoring(entry: LogEntry) {
    if (typeof navigator.sendBeacon === 'function') {
      const payload = JSON.stringify({
        level: entry.level,
        message: entry.message,
        timestamp: entry.timestamp,
        context: entry.context,
        error: entry.error ? {
          message: entry.error.message,
          stack: entry.error.stack
        } : undefined,
        userAgent: navigator.userAgent,
        url: window.location.href
      });

      navigator.sendBeacon('/api/log', payload);
    }
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log('error', message, context, error);
  }

  debug(message: string, context?: Record<string, any>) {
    if (this.isDevelopment) {
      this.log('debug', message, context);
    }
  }

  trackEvent(eventName: string, properties?: Record<string, any>) {
    this.info(`Event: ${eventName}`, properties);
  }

  trackPerformance(metricName: string, duration: number, context?: Record<string, any>) {
    this.info(`Performance: ${metricName}`, { duration, ...context });
  }
}

export const logger = new Logger();

export function logAuthEvent(event: string, userId?: string) {
  logger.info(`Auth: ${event}`, { userId });
}

export function logDatabaseOperation(operation: string, table: string, success: boolean, duration?: number) {
  const level = success ? 'info' : 'error';
  logger[level](`DB: ${operation} on ${table}`, { success, duration });
}

export function logAPICall(endpoint: string, method: string, status: number, duration: number) {
  logger.info(`API: ${method} ${endpoint}`, { status, duration });
}
