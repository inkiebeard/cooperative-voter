import { Poll, Ledger, Participant } from "./index";
import { logger, secretGenerator } from "./utils";
import { LOG_COLOURS } from "./utils/logger";

describe("basic test", () => {
  let poll, participant, ledger: Ledger, jsonL: string, secret: string;

  beforeAll(() => {
    secret = secretGenerator();
  });

  it("should create a poll", () => {
    poll = new Poll("What is your favorite color?", ["Red", "Blue", "Green"]);
    expect(poll).toBeInstanceOf(Poll);
    expect(poll.question).toBe("What is your favorite color?");
  });

  it("should create a participant", () => {
    participant = new Participant("John Doe", "jd@test.com", "fake-password");
    expect(participant).toBeInstanceOf(Participant);
    expect(participant.name).toBe("John Doe");
    expect(participant.email).toBe("jd@test.com");
    expect(participant.pass).not.toBe("fake-password");
  });

  it("should create a ledger", () => {
    ledger = new Ledger(secret, []);
    expect(ledger).toBeInstanceOf(Ledger);
    expect(Object.values(ledger.data)).toHaveLength(0);
  });

  it("should add a poll to the ledger", () => {
    ledger.addPoll(poll);
    expect(ledger.latestData.polls.length).toBe(1);
  });

  it("should add a vote to the ledger", () => {
    ledger.addVote(poll.id, poll.options[0].id, participant);
    expect(Object.values(ledger.latestData.votes).length).toBe(1);
    expect(ledger.latestData.votes[poll.id].totals[poll.options[0].id]).toEqual(1);
    expect(ledger.latestData.votes[poll.id].voters.length).toBe(1);
    expect(ledger.latestData.votes[poll.id].voters).not.toContain(
      participant.id
    );
  });

  it("shouldn't add another vote to the ledger for participant", () => {
    try {
      ledger.addVote(poll.id, poll.options[2].id, participant);
      console.log("shouldn't have added another vote");
    } catch (e: any) {
      expect(e.message).toBe("Already voted");
      expect(Object.values(ledger.latestData.votes).length).toBe(1);
      expect(ledger.latestData.votes[poll.id].totals[poll.options[0].id]).toEqual(1);
      expect(ledger.latestData.votes[poll.id].voters.length).toBe(1);
      expect(ledger.latestData.votes[poll.id].voters).not.toContain(
        participant.id
      );
    }
  });

  it("should export the ledger", () => {
    jsonL = JSON.stringify(ledger);
    expect(typeof jsonL).toEqual('string');
    expect(jsonL).toContain(`{"totals":{"${poll.options[0].id}":1}`);
  });

  it("should restore a ledger from JSON", () => {
    try {
      ledger = Ledger.fromJSON(jsonL, secret);
      expect(ledger).toBeInstanceOf(Ledger);
      expect(ledger.latestData.polls.length).toBe(1);
      expect(Object.values(ledger.latestData.votes).length).toBe(1);
    } catch (e: any) {
      logger.log(["should restore a ledger from JSON", e.message, e.stack], LOG_COLOURS.bg.red);
      throw new Error('failed to restore ledger from JSON')
    }
  });
});
