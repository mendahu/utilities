// Example of using utilities with ESM
// Run with: node examples/esm-example.mjs

// Option 1: Import everything
import { Logger, TypedEventEmitter, createLogger } from 'utilities';

// Option 2: Import only what you need (tree-shakeable)
// import { Logger } from 'utilities/logger';
// import { TypedEventEmitter } from 'utilities/typed-event-emitter';

console.log('=== Logger Example ===\n');

// Create a logger instance
const logger = createLogger({ code: 'EXAMPLE' });

logger.log('This is an info message');
logger.warn('This is a warning');
logger.error('This is an error');
logger.debug('This is a debug message');

console.log('\n=== TypedEventEmitter Example ===\n');

// Define event types
const emitter = new TypedEventEmitter();

// Register listeners
emitter.on('userCreated', (user) => {
  console.log(`Event received: User ${user.name} created with ID ${user.id}`);
});

emitter.on('statusChanged', (status) => {
  console.log(`Event received: Status changed to ${status}`);
});

// Emit events
emitter.emit('userCreated', { id: '123', name: 'John Doe' });
emitter.emit('statusChanged', 'online');

console.log('\n=== Example completed ===');

