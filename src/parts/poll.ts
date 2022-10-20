import Ledger from './ledger'
import { IPollOption } from '../types'

class Poll {
  question: string
  options: IPollOption[]
  ledger: Ledger

  constructor(question: string, options: IPollOption[], ledger: Ledger) {
    this.question = question
    this.options = options
    this.ledger = ledger
  }

  vote(option: IPollOption, userId: string) {
    this.ledger.addVote(option.id, userId)
  }
}

export default Poll