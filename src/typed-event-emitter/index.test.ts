import { describe, it, expect, vi, beforeEach } from "vitest";
import { TypedEventEmitter } from "./index";

// Define test event interfaces
interface TestEvents {
  message: (text: string) => void;
  data: (id: number, name: string) => void;
  complete: () => void;
  error: (error: Error) => void;
}

describe("TypedEventEmitter", () => {
  let emitter: TypedEventEmitter<TestEvents>;

  beforeEach(() => {
    emitter = new TypedEventEmitter<TestEvents>();
  });

  describe("on() - Register listeners", () => {
    it("should register a listener and call it when event is emitted", () => {
      const listener = vi.fn();
      emitter.on("message", listener);
      emitter.emit("message", "test");

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith("test");
    });

    it("should handle multiple arguments", () => {
      const listener = vi.fn();
      emitter.on("data", listener);
      emitter.emit("data", 42, "test");

      expect(listener).toHaveBeenCalledWith(42, "test");
    });

    it("should handle events with no arguments", () => {
      const listener = vi.fn();
      emitter.on("complete", listener);
      emitter.emit("complete");

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith();
    });

    it("should register multiple listeners for the same event", () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      const listener3 = vi.fn();

      emitter.on("message", listener1);
      emitter.on("message", listener2);
      emitter.on("message", listener3);

      emitter.emit("message", "test");

      expect(listener1).toHaveBeenCalledWith("test");
      expect(listener2).toHaveBeenCalledWith("test");
      expect(listener3).toHaveBeenCalledWith("test");
    });

    it("should call listeners in the order they were added", () => {
      const callOrder: number[] = [];
      const listener1 = vi.fn(() => callOrder.push(1));
      const listener2 = vi.fn(() => callOrder.push(2));
      const listener3 = vi.fn(() => callOrder.push(3));

      emitter.on("message", listener1);
      emitter.on("message", listener2);
      emitter.on("message", listener3);

      emitter.emit("message", "test");

      expect(callOrder).toEqual([1, 2, 3]);
    });

    it("should return the emitter instance for chaining", () => {
      const listener = vi.fn();
      const result = emitter.on("message", listener);

      expect(result).toBe(emitter);
    });
  });

  describe("once() - Register one-time listeners", () => {
    it("should call listener only once", () => {
      const listener = vi.fn();
      emitter.once("message", listener);

      emitter.emit("message", "first");
      emitter.emit("message", "second");
      emitter.emit("message", "third");

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith("first");
    });

    it("should work with multiple once listeners", () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      emitter.once("message", listener1);
      emitter.once("message", listener2);

      emitter.emit("message", "test");

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);

      emitter.emit("message", "test2");

      // Still only called once
      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });

    it("should work alongside regular listeners", () => {
      const regularListener = vi.fn();
      const onceListener = vi.fn();

      emitter.on("message", regularListener);
      emitter.once("message", onceListener);

      emitter.emit("message", "first");
      emitter.emit("message", "second");

      expect(regularListener).toHaveBeenCalledTimes(2);
      expect(onceListener).toHaveBeenCalledTimes(1);
    });

    it("should return the emitter instance for chaining", () => {
      const listener = vi.fn();
      const result = emitter.once("message", listener);

      expect(result).toBe(emitter);
    });
  });

  describe("emit() - Emit events", () => {
    it("should return true when listeners exist", () => {
      emitter.on("message", vi.fn());
      const result = emitter.emit("message", "test");

      expect(result).toBe(true);
    });

    it("should return false when no listeners exist", () => {
      const result = emitter.emit("message", "test");

      expect(result).toBe(false);
    });

    it("should not throw when emitting with no listeners", () => {
      expect(() => emitter.emit("message", "test")).not.toThrow();
    });

    it("should handle errors thrown by listeners", () => {
      const errorListener = vi.fn(() => {
        throw new Error("Listener error");
      });
      const normalListener = vi.fn();

      emitter.on("message", errorListener);
      emitter.on("message", normalListener);

      // In Node.js EventEmitter, if a listener throws, it stops execution
      expect(() => emitter.emit("message", "test")).toThrow("Listener error");
      expect(errorListener).toHaveBeenCalledTimes(1);
    });
  });

  describe("off() - Remove listeners", () => {
    it("should remove a specific listener", () => {
      const listener = vi.fn();
      emitter.on("message", listener);
      emitter.off("message", listener);
      emitter.emit("message", "test");

      expect(listener).not.toHaveBeenCalled();
    });

    it("should only remove the specified listener", () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      emitter.on("message", listener1);
      emitter.on("message", listener2);
      emitter.off("message", listener1);
      emitter.emit("message", "test");

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalledWith("test");
    });

    it("should not throw when removing non-existent listener", () => {
      const listener = vi.fn();
      expect(() => emitter.off("message", listener)).not.toThrow();
    });

    it("should return the emitter instance for chaining", () => {
      const listener = vi.fn();
      const result = emitter.off("message", listener);

      expect(result).toBe(emitter);
    });

    it("should work with once listeners", () => {
      const listener = vi.fn();
      emitter.once("message", listener);
      emitter.off("message", listener);
      emitter.emit("message", "test");

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe("removeListener() - Remove listeners (alias)", () => {
    it("should work identically to off()", () => {
      const listener = vi.fn();
      emitter.on("message", listener);
      emitter.removeListener("message", listener);
      emitter.emit("message", "test");

      expect(listener).not.toHaveBeenCalled();
    });

    it("should return the emitter instance for chaining", () => {
      const listener = vi.fn();
      const result = emitter.removeListener("message", listener);

      expect(result).toBe(emitter);
    });
  });

  describe("removeAllListeners() - Remove all listeners", () => {
    it("should remove all listeners for a specific event", () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      const listener3 = vi.fn();

      emitter.on("message", listener1);
      emitter.on("message", listener2);
      emitter.on("data", listener3);

      emitter.removeAllListeners("message");
      emitter.emit("message", "test");
      emitter.emit("data", 42, "test");

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
      expect(listener3).toHaveBeenCalledWith(42, "test");
    });

    it("should remove all listeners for all events when no event specified", () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      const listener3 = vi.fn();

      emitter.on("message", listener1);
      emitter.on("data", listener2);
      emitter.on("complete", listener3);

      emitter.removeAllListeners();

      emitter.emit("message", "test");
      emitter.emit("data", 42, "test");
      emitter.emit("complete");

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
      expect(listener3).not.toHaveBeenCalled();
    });

    it("should not throw when removing listeners from non-existent event", () => {
      expect(() => emitter.removeAllListeners("message")).not.toThrow();
    });

    it("should return the emitter instance for chaining", () => {
      const result = emitter.removeAllListeners("message");
      expect(result).toBe(emitter);
    });
  });

  describe("listeners() - Get listeners", () => {
    it("should return empty array when no listeners exist", () => {
      const listeners = emitter.listeners("message");
      expect(listeners).toEqual([]);
    });

    it("should return array of listeners for an event", () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      emitter.on("message", listener1);
      emitter.on("message", listener2);

      const listeners = emitter.listeners("message");

      expect(listeners).toHaveLength(2);
      expect(listeners).toContain(listener1);
      expect(listeners).toContain(listener2);
    });

    it("should return listeners in the order they were added", () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      const listener3 = vi.fn();

      emitter.on("message", listener1);
      emitter.on("message", listener2);
      emitter.on("message", listener3);

      const listeners = emitter.listeners("message");

      expect(listeners[0]).toBe(listener1);
      expect(listeners[1]).toBe(listener2);
      expect(listeners[2]).toBe(listener3);
    });

    it("should include once listeners", () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      emitter.on("message", listener1);
      emitter.once("message", listener2);

      const listeners = emitter.listeners("message");

      expect(listeners).toHaveLength(2);
    });

    it("should not include listeners from other events", () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      emitter.on("message", listener1);
      emitter.on("data", listener2);

      const listeners = emitter.listeners("message");

      expect(listeners).toHaveLength(1);
      expect(listeners[0]).toBe(listener1);
    });
  });

  describe("prependListener() - Prepend listeners", () => {
    it("should add listener to the beginning of the listeners array", () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      const listener3 = vi.fn();

      emitter.on("message", listener1);
      emitter.on("message", listener2);
      emitter.prependListener("message", listener3);

      const listeners = emitter.listeners("message");

      expect(listeners[0]).toBe(listener3);
      expect(listeners[1]).toBe(listener1);
      expect(listeners[2]).toBe(listener2);
    });

    it("should execute prepended listener first", () => {
      const callOrder: number[] = [];
      const listener1 = vi.fn(() => callOrder.push(1));
      const listener2 = vi.fn(() => callOrder.push(2));
      const listener3 = vi.fn(() => callOrder.push(3));

      emitter.on("message", listener1);
      emitter.on("message", listener2);
      emitter.prependListener("message", listener3);

      emitter.emit("message", "test");

      expect(callOrder).toEqual([3, 1, 2]);
    });

    it("should return the emitter instance for chaining", () => {
      const listener = vi.fn();
      const result = emitter.prependListener("message", listener);

      expect(result).toBe(emitter);
    });

    it("should work when no other listeners exist", () => {
      const listener = vi.fn();
      emitter.prependListener("message", listener);
      emitter.emit("message", "test");

      expect(listener).toHaveBeenCalledWith("test");
    });
  });

  describe("prependOnceListener() - Prepend one-time listeners", () => {
    it("should add one-time listener to the beginning", () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      const listener3 = vi.fn();

      emitter.on("message", listener1);
      emitter.on("message", listener2);
      emitter.prependOnceListener("message", listener3);

      const listeners = emitter.listeners("message");

      expect(listeners[0]).not.toBe(listener1);
      expect(listeners[0]).not.toBe(listener2);
    });

    it("should execute prepended listener first and only once", () => {
      const callOrder: number[] = [];
      const listener1 = vi.fn(() => callOrder.push(1));
      const listener2 = vi.fn(() => callOrder.push(2));
      const listener3 = vi.fn(() => callOrder.push(3));

      emitter.on("message", listener1);
      emitter.on("message", listener2);
      emitter.prependOnceListener("message", listener3);

      emitter.emit("message", "first");
      emitter.emit("message", "second");

      expect(listener3).toHaveBeenCalledTimes(1);
      expect(listener1).toHaveBeenCalledTimes(2);
      expect(listener2).toHaveBeenCalledTimes(2);
      expect(callOrder).toEqual([3, 1, 2, 1, 2]);
    });

    it("should return the emitter instance for chaining", () => {
      const listener = vi.fn();
      const result = emitter.prependOnceListener("message", listener);

      expect(result).toBe(emitter);
    });

    it("should work when no other listeners exist", () => {
      const listener = vi.fn();
      emitter.prependOnceListener("message", listener);

      emitter.emit("message", "first");
      emitter.emit("message", "second");

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith("first");
    });
  });

  describe("Method Chaining", () => {
    it("should allow chaining multiple method calls", () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      const listener3 = vi.fn();

      emitter
        .on("message", listener1)
        .once("data", listener2)
        .prependListener("complete", listener3);

      emitter.emit("message", "test");
      emitter.emit("data", 42, "test");
      emitter.emit("complete");

      expect(listener1).toHaveBeenCalledWith("test");
      expect(listener2).toHaveBeenCalledWith(42, "test");
      expect(listener3).toHaveBeenCalled();
    });
  });

  describe("Complex Event Types", () => {
    it("should handle Error objects correctly", () => {
      const listener = vi.fn();
      const testError = new Error("Test error");

      emitter.on("error", listener);
      emitter.emit("error", testError);

      expect(listener).toHaveBeenCalledWith(testError);
      expect(listener.mock.calls[0][0]).toBe(testError);
    });

    it("should handle complex objects as arguments", () => {
      interface ComplexEvents {
        complexData: (data: { id: number; nested: { value: string } }) => void;
      }

      const complexEmitter = new TypedEventEmitter<ComplexEvents>();
      const listener = vi.fn();
      const complexData = { id: 1, nested: { value: "test" } };

      complexEmitter.on("complexData", listener);
      complexEmitter.emit("complexData", complexData);

      expect(listener).toHaveBeenCalledWith(complexData);
    });
  });

  describe("Edge Cases", () => {
    it("should handle adding the same listener multiple times", () => {
      const listener = vi.fn();

      emitter.on("message", listener);
      emitter.on("message", listener);

      emitter.emit("message", "test");

      // Node's EventEmitter allows the same listener to be added multiple times
      expect(listener).toHaveBeenCalledTimes(2);
    });

    it("should handle removing listener that was added multiple times", () => {
      const listener = vi.fn();

      emitter.on("message", listener);
      emitter.on("message", listener);
      emitter.off("message", listener);

      emitter.emit("message", "test");

      // off() only removes one instance
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("should work with many listeners", () => {
      const listeners = Array.from({ length: 100 }, () => vi.fn());

      listeners.forEach((listener) => emitter.on("message", listener));
      emitter.emit("message", "test");

      listeners.forEach((listener) => {
        expect(listener).toHaveBeenCalledWith("test");
      });
    });

    it("should handle rapid emit calls", () => {
      const listener = vi.fn();
      emitter.on("message", listener);

      for (let i = 0; i < 1000; i++) {
        emitter.emit("message", `message${i}`);
      }

      expect(listener).toHaveBeenCalledTimes(1000);
    });

    it("should maintain separate listener lists for different events", () => {
      const messageListener = vi.fn();
      const dataListener = vi.fn();
      const completeListener = vi.fn();

      emitter.on("message", messageListener);
      emitter.on("data", dataListener);
      emitter.on("complete", completeListener);

      emitter.emit("message", "test");

      expect(messageListener).toHaveBeenCalledTimes(1);
      expect(dataListener).not.toHaveBeenCalled();
      expect(completeListener).not.toHaveBeenCalled();
    });
  });

  describe("Multiple EventEmitter Instances", () => {
    it("should maintain separate state for different instances", () => {
      const emitter1 = new TypedEventEmitter<TestEvents>();
      const emitter2 = new TypedEventEmitter<TestEvents>();

      const listener1 = vi.fn();
      const listener2 = vi.fn();

      emitter1.on("message", listener1);
      emitter2.on("message", listener2);

      emitter1.emit("message", "test1");
      emitter2.emit("message", "test2");

      expect(listener1).toHaveBeenCalledWith("test1");
      expect(listener1).not.toHaveBeenCalledWith("test2");
      expect(listener2).toHaveBeenCalledWith("test2");
      expect(listener2).not.toHaveBeenCalledWith("test1");
    });
  });
});
