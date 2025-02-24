import { describe, it, beforeEach, expect } from "vitest"

describe("Cognitive Consensus Mechanism Contract", () => {
  let mockStorage: Map<string, any>
  let nextProposalId: number
  
  beforeEach(() => {
    mockStorage = new Map()
    nextProposalId = 0
  })
  
  const mockContractCall = (method: string, args: any[] = []) => {
    switch (method) {
      case "create-proposal":
        nextProposalId++
        mockStorage.set(`proposal-${nextProposalId}`, {
          description: args[0],
          votes_for: 0,
          votes_against: 0,
        })
        return { success: true, value: nextProposalId }
      case "vote":
        const [proposalId, voteFor] = args
        const proposal = mockStorage.get(`proposal-${proposalId}`)
        if (!proposal) return { success: false, error: "Proposal not found" }
        if (voteFor) {
          proposal.votes_for++
        } else {
          proposal.votes_against++
        }
        return { success: true }
      case "get-proposal":
        return { success: true, value: mockStorage.get(`proposal-${args[0]}`) }
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should create a proposal", () => {
    const result = mockContractCall("create-proposal", ["Test proposal"])
    expect(result.success).toBe(true)
    expect(result.value).toBe(1)
  })
  
  it("should vote on a proposal", () => {
    mockContractCall("create-proposal", ["Test proposal"])
    const result = mockContractCall("vote", [1, true])
    expect(result.success).toBe(true)
  })
  
  it("should retrieve a proposal with vote count", () => {
    mockContractCall("create-proposal", ["Test proposal"])
    mockContractCall("vote", [1, true])
    mockContractCall("vote", [1, false])
    const result = mockContractCall("get-proposal", [1])
    expect(result.success).toBe(true)
    expect(result.value).toEqual({
      description: "Test proposal",
      votes_for: 1,
      votes_against: 1,
    })
  })
  
  it("should fail to vote on non-existent proposal", () => {
    const result = mockContractCall("vote", [999, true])
    expect(result.success).toBe(false)
  })
})

