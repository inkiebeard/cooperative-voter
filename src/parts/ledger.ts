import { randomUUID, createHmac } from "crypto";
import Participant from "./participants";
import Poll from "./poll";
import { logger } from "../utils";

interface LedgerData {
  polls: Poll[];
  votes: {
    [pollId: string]: {
      totals: { [optionId: string]: number };
      voters: string[];
    };
  };
  extraData: any;
  prevHash: string;
  id: string;
}

class Ledger {
  id: string;
  secret: string;
  data: {
    [index: number]: LedgerData;
  };

  constructor(secret: string, polls = []) {
    this.id = randomUUID();
    this.secret = secret;
    this.data = {};

    if (polls.length > 0) {
      polls.forEach((poll) => this.addPoll(poll));
    }
  }

  addVote(pollId: string, optionId: string, voter: Participant) {
    const newBlock = { ...this.latestData };
    const poll = newBlock?.polls?.find((poll) => poll.id === pollId);
    if (!poll) {
      throw new Error("Poll not found");
    }
    const option = poll.options.find((option) => option.id === optionId);
    if (!option) {
      throw new Error("Option not found");
    }
    const hash = createHmac("sha256", this.secret)
      .update(voter.id)
      .digest("hex");

    if (!newBlock.votes) {
      newBlock.votes = {};
    }

    if (newBlock.votes[pollId]) {
      const vote = newBlock.votes[pollId];
      if (vote.voters.includes(hash)) {
        throw new Error("Already voted");
      }

      vote.voters.push(hash);
      if (!vote.totals.hasOwnProperty(optionId)) {
        vote.totals[optionId] = 0;
      }
      vote.totals[optionId]++;
    } else {
      newBlock.votes[pollId] = {
        totals: {
          [optionId]: 1,
        },
        voters: [hash],
      };
    }
    if (!this.addBlock(newBlock)) {
      logger.log("failed to add vote", logger.LOG_COLOURS.fg.crimson);
      throw new Error("Failed to add vote");
    }
  }

  addPoll(poll: Poll) {
    const newBlock = { ...this.latestData };
    if (!newBlock?.polls?.find((p) => p.id === poll.id)) {
      if (!newBlock?.polls) {
        newBlock.polls = [];
      }
      newBlock.polls.push(poll);
      if (!this.addBlock(newBlock)) {
        logger.log("failed to add poll", logger.LOG_COLOURS.fg.crimson);
        throw new Error("Failed to add poll");
      }
    } else {
      logger.log("poll already exists", logger.LOG_COLOURS.fg.yellow);
    }
  }

  addExtraData(data: any) {
    const newBlock = { ...this.latestData } ?? ({} as LedgerData);
    newBlock.extraData = {
      ...newBlock.extraData,
      ...data,
    };
    if (!this.addBlock(newBlock)) {
      logger.log("failed to add poll", logger.LOG_COLOURS.fg.crimson);
      throw new Error("Failed to add poll");
    }
  }

  addBlock(newBlock: LedgerData): boolean {
    newBlock.id = randomUUID();
    newBlock.prevHash = createHmac("sha256", this.secret)
      .update(JSON.stringify(this.latestData ?? ({} as LedgerData)))
      .digest("hex");
    let newIndex = Object.values(this.data).length;
    this.data[newIndex] = newBlock;
    if (this.validateChain()) {
      return true;
    } else {
      logger.log("chain is invalid", logger.LOG_COLOURS.fg.crimson);
      delete this.data[newIndex];
      return false;
    }
  }

  get latestData() {
    return Object.values(this.data).at(-1) ?? ({} as LedgerData);
  }

  validateChain(): boolean {
    if (global.DEBUG_VALIDATION) {
      logger.log(
        ["validating chain", this.$_debug_getBlockHashes()],
        logger.LOG_COLOURS.fg.yellow
      );
    }
    // validate chain
    const invalid = Object.keys(this.data)
      .map((k) => this.data[k])
      .filter((block, index) => {
        if (index !== 0) {
          const prevBlock = this.data[index - 1];
          const hash = createHmac("sha256", this.secret)
            .update(JSON.stringify(prevBlock))
            .digest("hex");
          return block.prevHash !== hash;
        }
        return false;
      });
    return invalid.length === 0;
  }

  toString(): string {
    const { secret, ...rest } = this;
    return JSON.stringify(rest, null, 2);
  }

  toJSON(): any {
    const { secret, ...rest } = this;
    return rest;
  }

  static fromJSON(json: string, secret: string): Ledger {
    let obj: any;

    try {
      obj = JSON.parse(json);
    } catch (e) {
      logger.log("Invalid ledger: invalid json", logger.LOG_COLOURS.fg.crimson);
      throw new Error("Invalid ledger: invalid json, could not parse");
    }

    const ledger = new Ledger(secret, []);
    ledger.data = obj.data;
    ledger.id = obj.id;
    if (ledger.validateChain()) {
      return ledger;
    }
    logger.log(
      "Invalid ledger: couldn't generate from json with given secret",
      logger.LOG_COLOURS.fg.crimson
    );
    throw new Error("Invalid ledger");
  }

  // debugging utils todo: remove
  $_debug_getBlockHashes() {
    return Object.values(this.data).map((block, index, array) => {
      let dynamicPrevHash =
        index === 0
          ? ""
          : createHmac("sha256", this.secret)
              .update(JSON.stringify(array[index - 1] ?? ""))
              .digest("hex");
      return {
        prevHash: block.prevHash,
        dynamicPrevHash,
        myHash: createHmac("sha256", this.secret)
          .update(JSON.stringify(block))
          .digest("hex"),
        doesMyPrevHashMatch: block.prevHash === dynamicPrevHash,
      };
    });
  }
}

export default Ledger;
