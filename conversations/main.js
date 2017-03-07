'use strict'

var tools = require('../tools'),
    simpleMessage = require('./simpleMessage'),
    simplePayload = require('./simplePayload'),
    quickReply = require('./quickReply'),
    attachments = require('./attachments');
const translate = require('google-translate-api');

var manage = function(req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]

        let participants = {
            sender: event.recipient.id,
            receiver: event.sender.id
        }
        if (!Boolean(event.delivery) && !Boolean(event.read)) {
            tools.messageSeen(participants).then(function(body) {
                tools.typing(true, participants).then(function(body) {
                    if (event.message && event.message.text && !event.message.quick_reply && !Boolean(event.message.is_echo)) {
                        simpleMessage.manageSimpleMessage(event.message.text, participants).then(function(body) {});
                        i++;
                        return;
                    }
                    if (event.message && event.message.quick_reply && !Boolean(event.message.is_echo)) {
                        if (event.message.quick_reply) {
                            quickReply.manageQuickReply(event.message.quick_reply, participants).then(function(body) {});
                        }
                        i++;
                        return;
                    }
                    if (event.message && event.message.attachments && !Boolean(event.message.is_echo)) {
                        attachments.manageAttachments(event.message.attachments, participants).then(function(body) {});
                        i++;
                        return;
                    }
                    if (event.postback) {
                        simplePayload.manageSimplePayload(event.postback.payload, participants).then(function(body) {});
                        i++;
                        return;
                    }
                })
                tools.typing(false, participants);
            })
        }
    }
    res.sendStatus(200)
}

module.exports = {
    manage: manage
};
