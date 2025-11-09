/**
 * Logger options interface
 */
export interface LoggerOptions {
  namespace?: string;
  env?: string[];
}

/**
 * ANSI color codes for terminal output
 */
const Colors = {
  RED: "\x1b[31m",
  YELLOW: "\x1b[33m",
  RESET: "\x1b[0m",
} as const;

/**
 * Reusable logger utility for the application
 */
export class Logger {
  private code: string;
  private env: string[];

  constructor(options?: LoggerOptions) {
    this.code = options?.namespace ? options.namespace.toUpperCase() : "APP";
    this.env = options?.env || [];
  }

  /**
   * Check if the logger should output based on the current environment
   */
  private shouldLog(): boolean {
    // If no env filter is set, always log in all environments
    if (this.env.length === 0) {
      return true;
    }
    // If env filter is set, check if current env matches
    const currentEnv = process.env.NODE_ENV || "development";
    return this.env.includes(currentEnv);
  }

  /**
   * Log an informational message
   */
  log(message: string, ...args: any[]): void {
    if (this.shouldLog()) {
      console.log(`[${this.code}]: ${message}`, ...args);
    }
  }

  /**
   * Log an error message (colored red)
   */
  error(message: string, ...args: any[]): void {
    if (this.shouldLog()) {
      console.error(
        `${Colors.RED}[${this.code}]: ${message}${Colors.RESET}`,
        ...args
      );
    }
  }

  /**
   * Log a warning message (colored yellow)
   */
  warn(message: string, ...args: any[]): void {
    if (this.shouldLog()) {
      console.warn(
        `${Colors.YELLOW}[${this.code}]: ${message}${Colors.RESET}`,
        ...args
      );
    }
  }

  /**
   * Log a debug message
   */
  debug(message: string, ...args: any[]): void {
    if (this.shouldLog()) {
      console.debug(`[${this.code}]: ${message}`, ...args);
    }
  }
}

/**
 * Factory function to create a logger with specific options
 */
export function createLogger(options?: LoggerOptions): Logger {
  return new Logger(options);
}
