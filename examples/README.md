# Examples

This directory contains examples of how to use the utilities package in different environments.

## Prerequisites

Before running these examples, you need to install the package locally:

```bash
# From the root of the utilities repository
npm pack

# This creates a file like utilities-1.0.0.tgz
# Install it in your test project:
cd /path/to/your/test-project
npm install /path/to/utilities/utilities-1.0.0.tgz
```

Alternatively, once published to npm:

```bash
npm install utilities
```

## Available Examples

### 1. ESM Example (`esm-example.mjs`)

Demonstrates using the package with ES Modules.

**Run:**
```bash
node examples/esm-example.mjs
```

**Features:**
- Native ES6 import syntax
- Tree-shakeable imports
- Modern JavaScript

### 2. CommonJS Example (`cjs-example.cjs`)

Demonstrates using the package with CommonJS.

**Run:**
```bash
node examples/cjs-example.cjs
```

**Features:**
- Traditional require() syntax
- Works with older Node.js versions
- Compatible with legacy projects

### 3. TypeScript Example (`typescript-example.ts`)

Demonstrates using the package with TypeScript for full type safety.

**Compile and run:**
```bash
# Compile
tsc examples/typescript-example.ts --module esnext --moduleResolution bundler --target es2022

# Run
node examples/typescript-example.js
```

**Features:**
- Full TypeScript type safety
- IntelliSense/autocomplete support
- Compile-time error checking
- Strongly-typed event emitters

## What Each Example Shows

### Logger Usage

- Creating logger instances
- Using different log levels (log, warn, error, debug)
- Configuring logger options (code prefix, environment filtering)

### TypedEventEmitter Usage

- Creating typed event emitters
- Registering event listeners
- Emitting typed events
- Type safety for event names and payloads

## Testing Tree Shaking

To verify tree shaking works correctly:

1. Create a test file that only imports one utility:

```javascript
// test-tree-shaking.mjs
import { Logger } from 'utilities/logger';
const logger = new Logger({ code: 'TEST' });
logger.log('Testing tree shaking');
```

2. Bundle it with a bundler (webpack, rollup, or vite)

3. Check the bundle size - it should only include the Logger utility, not the TypedEventEmitter

## Integration Examples

### With Express.js

```javascript
import express from 'express';
import { createLogger } from 'utilities/logger';

const app = express();
const logger = createLogger({ code: 'API' });

app.get('/', (req, res) => {
  logger.log(`Request from ${req.ip}`);
  res.send('Hello World');
});

app.listen(3000, () => {
  logger.log('Server started on port 3000');
});
```

### With WebSocket Events

```typescript
import { WebSocketServer } from 'ws';
import { TypedEventEmitter } from 'utilities/typed-event-emitter';

interface WebSocketEvents {
  connection: (socket: WebSocket) => void;
  message: (data: string) => void;
  close: () => void;
}

const wsEvents = new TypedEventEmitter<WebSocketEvents>();

wsEvents.on('connection', (socket) => {
  console.log('Client connected');
});

wsEvents.on('message', (data) => {
  console.log('Message received:', data);
});
```

## Notes

- All examples use the same utilities but in different module systems
- The TypeScript example provides additional type safety
- Tree-shaking examples show how to optimize bundle size
- Integration examples demonstrate real-world usage patterns

