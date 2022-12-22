import { randomUUID } from "crypto";
import { IPollOption } from '../types'

class Poll {
  id: string
  question: string
  options: IPollOption[]

  constructor(question: string, options: string[]) {
    this.id = randomUUID()
    this.question = question
    this.options = new Array<IPollOption>()
    options.forEach(option => {
      this.options.push({
        id: randomUUID(),
        value: option
      })
    })
  }

  addOption(option: string) {
    this.options.push({
      id: randomUUID(),
      value: option
    })
  }

  addOptions(options: string[]) {
    options.forEach(option => {
      this.addOption(option)
    })
  }

  findOptionByValue(value: string) {
    return this.options.find(option => option.value === value)
  }

  toString() {
    const { id, question, options } = this
    return JSON.stringify({ id, question, options })
  }

  static fromString(str: string) {
    const { id, question, options } = JSON.parse(str)
    const poll = new Poll(question, [])
    poll.id = id
    poll.options = options
    return poll
  }
}

export default Poll