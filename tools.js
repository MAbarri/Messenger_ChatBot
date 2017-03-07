'use strict'

// app ID
const token = "EAAaQ1YqleZBEBAH0eP6CNbsVYTeGFIAwoiLiVPOworRu8gSJRB0pCZCJAvS9xoz5y9Tx22M8B2Ob8rLW6leniAhE08evcenl4mKrN3WZAwO7plyIusZAoSVhnliTy5O9ERQeJoimNxZBz1L8dtbZBUMSi5xBhUSrOXImkjDUbvegZDZD"

var rp = require('request-promise'),
    _ = require('underscore'),
    async = require("async");

var cleverbot = require("cleverbot.io"),
    bot = new cleverbot("P0fDnCNddRWk3iJe", "zsTtfzu3tlZBbR7dDwefOPTcilkKIEcl");

// const apiapiToken = "c1d4795ccfc14c1e99ef7a27ed9de0f2";
// const simsimiToken = "cd3ab818-9a82-4bdd-bc35-0d43d526041b";


var sendTextMessage = function(participants, text) {
    let messageData = {
        text: text
    }
    return serviceCall(messageData, participants)
}
var makeCall = function(message) {
    let messageData = {
        text: message
    }
    serviceCall(messageData, participants);
}
var sendListOfTextMessages = function(participants, textTable, callback) {
    async.every(textTable, function(message, makeCall) {
        makeCall(message)
    }, function(err, result) {
      console.log(result)
      console.log(err)
      if(result)
        callback();
        console.log(err)
    });
}
var sendAutoTextMessage = function(participants, text) {
    bot.setNick("sessionname");
    bot.create(function(err, session) {
        bot.ask(text, function(err, response) {
            let messageData = {
                text: response
            }
            return serviceCall(messageData, participants)
        });
    });
}
var sendDefaultTextMessage = function(participants, text) {
    let messageData = {
        text: text
    }
    return serviceCall(messageData, participants)
}
var sendGenericMessage = function(participants, templates) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": JSON.stringify(templates)
            }
        }
    }
    return serviceCall(messageData, participants)
}
var sendListMessage = function(participants, templates) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "list",
                "elements": JSON.stringify(templates.element),
                "buttons": JSON.stringify(templates.buttons)
            }
        }
    }
    return serviceCall(messageData, participants)
}
var sendFastResponse = function(participants, replies, text) {
    let messageData = {
        "text": text,
        "quick_replies": replies
    }
    return serviceCall(messageData, participants)
}

var serviceCall = function(element, participants) {
    var options = {
        method: 'POST',
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        form: {
            sender: {
                id: participants.sender
            },
            recipient: {
                id: participants.receiver
            },
            message: element,
        },
        qs: {
            access_token: token
        }
    };
    return rp(options);
}
var typing = function(status, participants) {
    var action = status ? "typing_on" : "typing_off";
    var options = {
        method: 'POST',
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        form: {
            sender: {
                id: participants.sender
            },
            recipient: {
                id: participants.receiver
            },
            sender_action: action
        },
        qs: {
            access_token: token
        }
    };
    return rp(options);
}
var messageSeen = function(participants) {
    var options = {
        method: 'POST',
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        form: {
            sender: {
                id: participants.sender
            },
            recipient: {
                id: participants.receiver
            },
            sender_action: "mark_seen"
        },
        qs: {
            access_token: token
        }
    };
    return rp(options);
}
module.exports = {
    typing: typing,
    messageSeen: messageSeen,
    sendTextMessage: sendTextMessage,
    sendListOfTextMessages: sendListOfTextMessages,
    sendAutoTextMessage: sendAutoTextMessage,
    sendGenericMessage: sendGenericMessage,
    sendFastResponse: sendFastResponse,
    sendDefaultTextMessage: sendDefaultTextMessage,
    sendListMessage: sendListMessage
};
