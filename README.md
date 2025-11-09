# Utilities

General purpose zero-dependency JavaScript utilities for any Node application.

## Features

- 🌲 **Tree-shakeable** - Only bundle what you use
- 📦 **Dual Package** - Supports both ESM and CommonJS
- 🔷 **TypeScript First** - Full type definitions included
- 🪶 **Zero Dependencies** - No external dependencies
- ✅ **Thoroughly Tested** - Comprehensive test coverage

## Installation

```bash
npm install @mendahu/utilities
```

## Usage

```typescript
// ESM - Import only what you need
import { Logger } from "utilities/logger";
import { TypedEventEmitter } from "utilities/typed-event-emitter";

// CommonJS
const { Logger } = require("utilities/logger");
const { TypedEventEmitter } = require("utilities/typed-event-emitter");
```

## Available Utilities

### Logger

A flexible logger utility with environment-based filtering and colored output.

```typescript
import { Logger, createLogger } from "utilities/logger";

// Create a logger instance
const logger = new Logger({
  namespace: "APP",
  env: ["development", "production"],
});

// Or use the factory function
const logger = createLogger({ namespace: "API" });

// Log messages
logger.log("Application started");
logger.error("An error occurred");
logger.warn("Warning message");
logger.debug("Debug information");
```

#### Logger Options

- `namespace` (string, optional): Prefix code for log messages (default: "APP")
- `env` (string[], optional): Array of environments where logging is enabled (default: all environments)

### TypedEventEmitter

A type-safe EventEmitter that ensures type safety for event names and payloads.

```typescript
import { TypedEventEmitter } from "utilities/typed-event-emitter";

// Define your events interface
interface MyEvents {
  userCreated: (user: { id: string; name: string }) => void;
  userDeleted: (userId: string, reason: string) => void;
  statusChanged: (status: "online" | "offline") => void;
}

// Create a typed event emitter
const emitter = new TypedEventEmitter<MyEvents>();

// Register listeners with full type safety
emitter.on("userCreated", (user) => {
  // 'user' is automatically typed as { id: string; name: string }
  console.log(`User created: ${user.name}`);
});

emitter.on("userDeleted", (userId, reason) => {
  // Both parameters are fully typed
  console.log(`User ${userId} deleted: ${reason}`);
});

// Emit events with type checking
emitter.emit("userCreated", { id: "123", name: "John" }); // ✓ Valid
emitter.emit("userDeleted", "123", "Account closed"); // ✓ Valid

// TypeScript will catch errors at compile time:
// emitter.emit('userCreated', { id: 123 }); // ✗ Type error: missing 'name'
// emitter.emit('invalidEvent', 'data'); // ✗ Type error: event doesn't exist
```

#### Available Methods

All standard EventEmitter methods are supported with full type safety:

- `on(event, listener)` - Register a listener
- `once(event, listener)` - Register a one-time listener
- `off(event, listener)` - Remove a listener
- `emit(event, ...args)` - Emit an event
- `removeListener(event, listener)` - Remove a listener (alias for `off`)
- `removeAllListeners(event?)` - Remove all listeners
- `listeners(event)` - Get all listeners for an event
- `prependListener(event, listener)` - Add listener to beginning
- `prependOnceListener(event, listener)` - Add one-time listener to beginning
