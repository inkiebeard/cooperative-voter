import { Poll, Ledger, Participant } from './index'
import { secretGenerator } from './utils'

describe('basic test', () => {
  let poll, participant, ledger, jsonL, secret

  beforeAll(() => {
    secret = secretGenerator()
  })

  it('should create a poll', () => {
    poll = new Poll('What is your favorite color?', ['Red', 'Blue', 'Green'])
    expect(poll).toBeInstanceOf(Poll)
    expect(poll.question).toBe('What is your favorite color?')
  })

  it('should create a participant', () => {
    participant = new Participant('John Doe', 'jd@test.com', 'fake-password')
    expect(participant).toBeInstanceOf(Participant)
    expect(participant.name).toBe('John Doe')
    expect(participant.email).toBe('jd@test.com')
    expect(participant.pass).not.toBe('fake-password')
  })

  it('should create a ledger', () => {
    ledger = new Ledger(secret, [])
    expect(ledger).toBeInstanceOf(Ledger)
  })

  it('should add a poll to the ledger', () => {
    ledger.addPoll(poll)
    expect(ledger.latestData.polls.length).toBe(1)
  })

  it('should add a vote to the ledger', () => {
    ledger.addVote(poll.id, poll.options[0].id, participant)
    expect(ledger.latestData.votes.length).toBe(1)
    expect(ledger.latestData.votes[poll._id].totals[poll.options[0]]).toBe(1)
    expect(ledger.latestData.votes[poll._id].voters.length).toBe(1)
    expect(ledger.latestData.votes[poll._id].voters).not.toContain(participant.id)
  })

  it('should add a second vote to the ledger', () => {
    jsonL = JSON.stringify(ledger)
    expect(jsonL).toBeInstanceOf(String)
  })

  it('should create a new ledger from JSON', () => {
    ledger = Ledger.fromJSON(jsonL, secret)
    expect(ledger).toBeInstanceOf(Ledger)
  })

})