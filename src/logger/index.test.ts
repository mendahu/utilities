import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Logger, createLogger, LoggerOptions } from "./index";

describe("Logger", () => {
  let consoleLogSpy: any;
  let consoleErrorSpy: any;
  let consoleWarnSpy: any;
  let consoleDebugSpy: any;
  let originalEnv: string | undefined;

  beforeEach(() => {
    // Spy on console methods
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    consoleDebugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});

    // Store original NODE_ENV
    originalEnv = process.env.NODE_ENV;
  });

  afterEach(() => {
    // Restore all mocks
    vi.restoreAllMocks();

    // Restore original NODE_ENV
    if (originalEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = originalEnv;
    }
  });

  describe("Constructor and Options", () => {
    it("should use default code 'APP' when no options provided", () => {
      const logger = new Logger();
      logger.log("test");

      expect(consoleLogSpy).toHaveBeenCalledWith("[APP]: test");
    });

    it("should use custom code when provided", () => {
      const logger = new Logger({ namespace: "api" });
      logger.log("test");

      expect(consoleLogSpy).toHaveBeenCalledWith("[API]: test");
    });

    it("should convert code to uppercase", () => {
      const logger = new Logger({ namespace: "database" });
      logger.log("test");

      expect(consoleLogSpy).toHaveBeenCalledWith("[DATABASE]: test");
    });

    it("should accept empty options object", () => {
      const logger = new Logger({});
      logger.log("test");

      expect(consoleLogSpy).toHaveBeenCalledWith("[APP]: test");
    });
  });

  describe("Environment Filtering", () => {
    it("should log in all environments when no env filter is set", () => {
      const logger = new Logger({ namespace: "TEST" });

      process.env.NODE_ENV = "test";
      logger.log("test env");
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);

      process.env.NODE_ENV = "development";
      logger.log("dev env");
      expect(consoleLogSpy).toHaveBeenCalledTimes(2);

      process.env.NODE_ENV = "production";
      logger.log("prod env");
      expect(consoleLogSpy).toHaveBeenCalledTimes(3);
    });

    it("should only log in specified environments", () => {
      const logger = new Logger({
        namespace: "TEST",
        env: ["production", "staging"],
      });

      process.env.NODE_ENV = "development";
      logger.log("should not log");
      expect(consoleLogSpy).not.toHaveBeenCalled();

      process.env.NODE_ENV = "production";
      logger.log("should log");
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);

      process.env.NODE_ENV = "staging";
      logger.log("should also log");
      expect(consoleLogSpy).toHaveBeenCalledTimes(2);
    });

    it("should default to 'development' when NODE_ENV is not set", () => {
      delete process.env.NODE_ENV;

      const logger = new Logger({
        namespace: "TEST",
        env: ["development"],
      });

      logger.log("should log");
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    });

    it("should not log when env filter does not match", () => {
      const logger = new Logger({
        namespace: "TEST",
        env: ["production"],
      });

      process.env.NODE_ENV = "test";
      logger.log("should not log");
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });

  describe("Log Methods", () => {
    it("should log informational messages", () => {
      const logger = new Logger({ namespace: "INFO" });
      logger.log("test message", { data: "value" });

      expect(consoleLogSpy).toHaveBeenCalledWith("[INFO]: test message", {
        data: "value",
      });
    });

    it("should log error messages with red color", () => {
      const logger = new Logger({ namespace: "ERROR" });
      logger.error("error message", { error: "details" });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "\x1b[31m[ERROR]: error message\x1b[0m",
        { error: "details" }
      );
    });

    it("should log warning messages with yellow color", () => {
      const logger = new Logger({ namespace: "WARN" });
      logger.warn("warning message", { warn: "details" });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "\x1b[33m[WARN]: warning message\x1b[0m",
        { warn: "details" }
      );
    });

    it("should log debug messages", () => {
      const logger = new Logger({ namespace: "DEBUG" });
      logger.debug("debug message", { debug: "info" });

      expect(consoleDebugSpy).toHaveBeenCalledWith("[DEBUG]: debug message", {
        debug: "info",
      });
    });

    it("should handle multiple arguments", () => {
      const logger = new Logger({ namespace: "MULTI" });
      logger.log("message", "arg1", "arg2", { key: "value" });

      expect(consoleLogSpy).toHaveBeenCalledWith(
        "[MULTI]: message",
        "arg1",
        "arg2",
        { key: "value" }
      );
    });

    it("should handle no additional arguments", () => {
      const logger = new Logger({ namespace: "SIMPLE" });
      logger.log("just a message");

      expect(consoleLogSpy).toHaveBeenCalledWith("[SIMPLE]: just a message");
    });
  });

  describe("Color Codes", () => {
    it("should apply red color to error messages", () => {
      const logger = new Logger({ namespace: "TEST" });
      logger.error("error");

      const [message] = consoleErrorSpy.mock.calls[0];
      expect(message).toContain("\x1b[31m"); // Red color code
      expect(message).toContain("\x1b[0m"); // Reset code
    });

    it("should apply yellow color to warning messages", () => {
      const logger = new Logger({ namespace: "TEST" });
      logger.warn("warning");

      const [message] = consoleWarnSpy.mock.calls[0];
      expect(message).toContain("\x1b[33m"); // Yellow color code
      expect(message).toContain("\x1b[0m"); // Reset code
    });

    it("should not apply colors to log messages", () => {
      const logger = new Logger({ namespace: "TEST" });
      logger.log("info");

      const [message] = consoleLogSpy.mock.calls[0];
      expect(message).not.toContain("\x1b[");
    });

    it("should not apply colors to debug messages", () => {
      const logger = new Logger({ namespace: "TEST" });
      logger.debug("debug");

      const [message] = consoleDebugSpy.mock.calls[0];
      expect(message).not.toContain("\x1b[");
    });
  });

  describe("Factory Function", () => {
    it("should create logger with no options", () => {
      const logger = createLogger();
      logger.log("test");

      expect(consoleLogSpy).toHaveBeenCalledWith("[APP]: test");
    });

    it("should create logger with options", () => {
      const logger = createLogger({ namespace: "FACTORY", env: ["test"] });

      process.env.NODE_ENV = "test";
      logger.log("test");

      expect(consoleLogSpy).toHaveBeenCalledWith("[FACTORY]: test");
    });

    it("should return Logger instance", () => {
      const logger = createLogger();
      expect(logger).toBeInstanceOf(Logger);
    });
  });

  describe("Integration Tests", () => {
    it("should work with all options combined", () => {
      const logger = new Logger({
        namespace: "integration",
        env: ["production"],
      });

      process.env.NODE_ENV = "production";

      logger.log("info message");
      logger.error("error message");
      logger.warn("warning message");
      logger.debug("debug message");

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
    });

    it("should not log when environment does not match filter", () => {
      const logger = new Logger({
        namespace: "integration",
        env: ["production"],
      });

      process.env.NODE_ENV = "development";

      logger.log("info");
      logger.error("error");
      logger.warn("warning");
      logger.debug("debug");

      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });
  });
});
