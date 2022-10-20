class Ledger {
  blocks: {
    data: any
    prevHash: string
    id: string
  }[]


  addVote(optionId, userId) {
    // hash userId
    // add vote for option
  }

  validateChain() {

  }

  toString() {
    // json stringify blocks
  }

  static fromJSON() {
    // generate Ledger from json
  }
}

export default Ledger