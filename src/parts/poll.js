"use strict";
exports.__esModule = true;
var Poll = /** @class */ (function () {
    function Poll(question, options, ledger) {
        this.question = question;
        this.options = options;
        this.ledger = ledger;
    }
    Poll.prototype.vote = function (option, userId) {
        this.ledger.addVote(option.id, userId);
    };
    return Poll;
}());
exports["default"] = Poll;
