// Example of using utilities with TypeScript
// Compile with: tsc examples/typescript-example.ts
// Run with: node examples/typescript-example.js

import { Logger, TypedEventEmitter, createLogger, type LoggerOptions } from 'utilities';

console.log('=== Logger Example (TypeScript) ===\n');

// Create a logger with typed options
const loggerOptions: LoggerOptions = {
  code: 'TS-EXAMPLE',
  env: ['development', 'production']
};

const logger = createLogger(loggerOptions);

logger.log('TypeScript example started');
logger.warn('This demonstrates type-safe logging');
logger.error('Errors are properly typed too');

console.log('\n=== TypedEventEmitter Example (TypeScript) ===\n');

// Define strongly-typed events
interface MyEvents {
  userCreated: (user: { id: string; name: string; email: string }) => void;
  userDeleted: (userId: string, reason: string) => void;
  statusChanged: (status: 'online' | 'offline' | 'away') => void;
  dataReceived: (data: number[]) => void;
}

const emitter = new TypedEventEmitter<MyEvents>();

// Register typed listeners
emitter.on('userCreated', (user) => {
  // 'user' is automatically typed as { id: string; name: string; email: string }
  console.log(`User created: ${user.name} (${user.email})`);
});

emitter.on('userDeleted', (userId, reason) => {
  // Both parameters are properly typed
  console.log(`User ${userId} deleted: ${reason}`);
});

emitter.on('statusChanged', (status) => {
  // 'status' is typed as 'online' | 'offline' | 'away'
  console.log(`Status changed to: ${status}`);
});

emitter.on('dataReceived', (data) => {
  // 'data' is typed as number[]
  console.log(`Received ${data.length} items:`, data);
});

// Emit events with full type checking
emitter.emit('userCreated', {
  id: '789',
  name: 'Alice Johnson',
  email: 'alice@example.com'
});

emitter.emit('userDeleted', '123', 'Account closed by user');
emitter.emit('statusChanged', 'online');
emitter.emit('dataReceived', [1, 2, 3, 4, 5]);

// TypeScript will catch these errors at compile time:
// emitter.emit('userCreated', { id: '123' }); // Error: missing 'name' and 'email'
// emitter.emit('statusChanged', 'invalid'); // Error: not a valid status
// emitter.emit('nonexistent', 'data'); // Error: event doesn't exist

console.log('\n=== Example completed ===');

