// Example of using utilities with CommonJS
// Run with: node examples/cjs-example.cjs

// Option 1: Require everything
const { Logger, TypedEventEmitter, createLogger } = require('utilities');

// Option 2: Require only what you need (tree-shakeable)
// const { Logger } = require('utilities/logger');
// const { TypedEventEmitter } = require('utilities/typed-event-emitter');

console.log('=== Logger Example (CommonJS) ===\n');

// Create a logger instance
const logger = createLogger({ code: 'CJS-EXAMPLE' });

logger.log('This is an info message');
logger.warn('This is a warning');
logger.error('This is an error');
logger.debug('This is a debug message');

console.log('\n=== TypedEventEmitter Example (CommonJS) ===\n');

// Create an event emitter
const emitter = new TypedEventEmitter();

// Register listeners
emitter.on('userCreated', (user) => {
  console.log(`Event received: User ${user.name} created with ID ${user.id}`);
});

emitter.on('statusChanged', (status) => {
  console.log(`Event received: Status changed to ${status}`);
});

// Emit events
emitter.emit('userCreated', { id: '456', name: 'Jane Smith' });
emitter.emit('statusChanged', 'offline');

console.log('\n=== Example completed ===');

