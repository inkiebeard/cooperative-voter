import { createHash, randomUUID } from "crypto";

class Participant {
  private _id: string;
  private _name: string;
  private _email: string;
  private _passHash: string;

  constructor(name, email, pass) {
    this._id = randomUUID();
    this.name = name;
    this._email = email;
    this.pass = pass;
  }

  get pass () { return this._passHash }
  get name () { return this._name }
  get email () { return this._email }
  get id () { return this._id }

  set name (val) { this._name = val }
  set pass (val) {
    const hash = createHash("sha256");
    hash.update(val);
    this._passHash = hash.digest("hex");
  }
}

export default Participant