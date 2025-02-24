import { describe, it, beforeEach, expect } from "vitest";

describe("Thought Quantization Contract", () => {
  let mockStorage: Map<string, any>;
  let nextThoughtId: number;
  
  beforeEach(() => {
    mockStorage = new Map();
    nextThoughtId = 0;
  });
  
  const mockContractCall = (method: string, args: any[] = [], sender = "default-sender") => {
    switch (method) {
      case "quantize-thought":
        const [content, quantity] = args;
        nextThoughtId++;
        mockStorage.set(`thought-${nextThoughtId}`, {
          content,
          creator: sender,
          quantity,
        });
        return { success: true, value: nextThoughtId };
      case "get-thought":
        return { success: true, value: mockStorage.get(`thought-${args[0]}`) };
      case "transfer-thought":
        const [id, recipient, amount] = args;
        const thought = mockStorage.get(`thought-${id}`);
        if (!thought || thought.creator !== sender || thought.quantity < amount) {
          return { success: false, error: "Transfer failed" };
        }
        thought.quantity -= amount;
        return { success: true };
      default:
        return { success: false, error: "Unknown method" };
    }
  };
  
  it("should quantize a thought", () => {
    const result = mockContractCall("quantize-thought", ["Test thought", 100], "user1");
    expect(result.success).toBe(true);
    expect(result.value).toBe(1);
  });
  
  it("should retrieve a thought", () => {
    mockContractCall("quantize-thought", ["Test thought", 100], "user1");
    const result = mockContractCall("get-thought", [1]);
    expect(result.success).toBe(true);
    expect(result.value).toEqual({
      content: "Test thought",
      creator: "user1",
      quantity: 100,
    });
  });
  
  it("should transfer a thought", () => {
    mockContractCall("quantize-thought", ["Test thought", 100], "user1");
    const result = mockContractCall("transfer-thought", [1, "user2", 50], "user1");
    expect(result.success).toBe(true);
    const updatedThought = mockContractCall("get-thought", [1]);
    expect(updatedThought.value.quantity).toBe(50);
  });
  
  it("should fail to transfer more than available quantity", () => {
    mockContractCall("quantize-thought", ["Test thought", 100], "user1");
    const result = mockContractCall("transfer-thought", [1, "user2", 150], "user1");
    expect(result.success).toBe(false);
  });
});
