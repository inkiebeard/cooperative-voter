"use strict";
exports.__esModule = true;
var crypto_1 = require("crypto");
var uuid_1 = require("uuid");
var hash = (0, crypto_1.createHash)("sha256");
var Participant = /** @class */ (function () {
    function Participant(name, email, pass) {
        this._id = (0, uuid_1.v4)();
        this._name = name;
        this._email = email;
        hash.update(pass);
        this._passHash = hash.digest("hex");
    }
    Object.defineProperty(Participant.prototype, "pass", {
        get: function () { return this._passHash; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Participant.prototype, "name", {
        get: function () { return this._name; },
        set: function (val) { this._name = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Participant.prototype, "email", {
        get: function () { return this._email; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Participant.prototype, "id", {
        get: function () { return this._id; },
        enumerable: false,
        configurable: true
    });
    return Participant;
}());
exports["default"] = Participant;
