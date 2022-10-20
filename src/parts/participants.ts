import { createHash } from "crypto";
import { v4 as uuid } from "uuid";

const hash = createHash("sha256");

class Participant {
  private _id: string;
  private _name: string;
  private _email: string;
  private _passHash: string;

  constructor(name, email, pass) {
    this._id = uuid();
    this._name = name;
    this._email = email;
    hash.update(pass);
    this._passHash = hash.digest("hex");
  }

  get pass () { return this._passHash }
  get name () { return this._name }
  get email () { return this._email }
  get id () { return this._id }

  set name (val) { this._name = val }
}

export default Participant