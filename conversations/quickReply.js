'use strict'

var tools = require('../tools'),
    _ = require('underscore'),
    emoji = require('node-emoji'),
    persistance = require('./bo/persistance'),
    conversations = [];
const translate = require('google-translate-api');

var importConversations = function(userId, callback) {
    return persistance.getLanguageCode(userId, function(langCode) {
        conversations['Generic'] = require('./translate/' + langCode + '/generic.json');
        callback();
    })
}

var manageQuickReply = function(quickReply, participants) {
    var simpleMsg = {};
    var payload = String(quickReply.payload);
    var reservNbr;
    if (payload.indexOf("/RESERVATION/") >= 0) {
        reservNbr = payload.substr(payload.indexOf("/RESERVATION/") + 13, 1)
        payload = payload.substring(0, payload.indexOf("/RESERVATION/"));
    }
    switch (payload) {
        case "CHANGE_LANGUAGE_TO_ENGLISH":
            {
                return changeLanguageCall('en', 'Great, language is set to: English', participants);
                break;
            }
        case "CHANGE_LANGUAGE_TO_ARABIC":
            {
                return changeLanguageCall('ar', 'رائع لقد تم تغيير اللغة الى : العربية', participants);
                break;
            }
        case "CHANGE_LANGUAGE_TO_FRENCH":
            {
                return changeLanguageCall('fr', 'Trés bien, La langue a été configuré a: Français', participants);
                break;
            }
        case "CHANGE_LANGUAGE_TO_SPANISH":
            {
                return changeLanguageCall('es', 'Perfecto, La idioma esta configurada ahora a : Español', participants);
                break;
            }
        case "GET_STARTED_CHANGE_LANGUAGE_TO_ENGLISH":
            {
                return changeLanguageCallStart('en', 'Great, language is set to: English', participants);
                break;
            }
        case "GET_STARTED_CHANGE_LANGUAGE_TO_ARABIC":
            {
                return changeLanguageCallStart('ar', 'رائع لقد تم تغيير اللغة الى : العربية', participants);
                break;
            }
        case "GET_STARTED_CHANGE_LANGUAGE_TO_FRENCH":
            {
                return changeLanguageCallStart('fr', 'Trés bien, La langue a été configuré a: Français', participants);
                break;
            }
        case "GET_STARTED_CHANGE_LANGUAGE_TO_SPANISH":
            {
                return changeLanguageCallStart('es', 'Perfecto, La idioma esta configurada ahora a : Español', participants);
                break;
            }
        case "CHOOSE_PROFILE_BUSINESS":
            {
                return importConversations(participants.receiver, function() {

                    var response = _.find(conversations['Generic'], function(item) {
                        return item.key === "QUICK_REPLY_HELP_BUSINESS"
                    });
                    return tools.sendListOfTextMessages(participants, response.content);
                })
                break;
            }
        case "CHOOSE_PROFILE_PERSONAL":
            {
                return importConversations(participants.receiver, function() {
                    var response = _.find(conversations['Generic'], function(item) {
                        return item.key === "QUICK_REPLY_HELP_PERSONAL"
                    });
                    return tools.sendListOfTextMessages(participants, response.content);
                })
                break;
            }
        case "ORDER_PIZZA":
            {
                return prepareOrder(participants, "PIZZA");
                break;
            }
        case "ORDER_SANDWICH":
            {
                return prepareOrder(participants, "SANDWICH");
                break;
            }
        case "ORDER_SALADE":
            {
                return prepareOrder(participants, "SALADE");
                break;
            }
        case "ORDER_BREAKFAST":
            {
                return prepareOrder(participants, "BREAKFAST");
                break;
            }
        case "MAKE_RESERVATION_2":
            {
                return prepareReservation(participants, "2");
                break;
            }
        case "MAKE_RESERVATION_4":
            {
                return prepareReservation(participants, "4");
                break;
            }
        case "MAKE_RESERVATION_6":
            {
                return prepareReservation(participants, "6");
                break;
            }
        case "MAKE_RESERVATION_MORE_7":
            {
                return prepareReservation(participants, "+7");
                break;
            }
        case "MAKE_RESERVATION_TODAY":
            {
                return persisteReservation(reservNbr, "TODAY", participants);
                break;
            }
        case "MAKE_RESERVATION_TOMORROW":
            {
                return persisteReservation(reservNbr, "TOMORROW", participants);
                break;
            }
        case "MAKE_RESERVATION_THIS_WEEK":
            {
                return persisteReservation(reservNbr, "THISWEEK", participants);
                break;
            }
        case "MAKE_RESERVATION_NEXT_WEEK":
            {
                return persisteReservation(reservNbr, "NEXTWEEK", participants);
                break;
            }
    }
}

var changeLanguageCall = function(lang, Msg, participants) {
    return persistance.changeLanguage(participants.receiver, lang, function() {
        return tools.sendTextMessage(participants, Msg);
    })
}
var changeLanguageCallStart = function(lang, Msg, participants) {
    return persistance.changeLanguage(participants.receiver, lang, function() {
        return tools.sendTextMessage(participants, Msg).then(function(body) {
                return importConversations(participants.receiver, function() {
                    var response = _.find(conversations['Generic'], function(item) {
                        return item.key === "CHANGE_LANGUAGE_GET_STARTED"
                    });
                    return tools.sendListOfTextMessages(participants, response.content, function() {
                        return importConversations(participants.receiver, function() {
                            var simpleMsg = _.find(conversations['Generic'], function(item) {
                                return item.key === "CHOOSE_PERSONAL_OR_BUSINESS"
                            });
                            console.log(simpleMsg)
                            return tools.sendFastResponse(participants, simpleMsg.replies, simpleMsg.title).then(function(body) {})
                                .catch(function(err) {
                                    console.log("err")
                                    // POST failed...
                                });
                        })
                    })
                })
            })
            .catch(function(err) {
                console.log("err")
                // POST failed...
            });
    })
}
var prepareReservation = function(participants, number) {
    var simpleMsg = {};
    simpleMsg.title = " Great, Can you please specify when would you like the reservation to take place ?\n\n PS: We don't accept reservations other than the displayed choices.";
    simpleMsg.replies = [{
        "content_type": "text",
        "title": "Today",
        "payload": "MAKE_RESERVATION_TODAY/RESERVATION/" + number
    }, {
        "content_type": "text",
        "title": "Tomorrow",
        "payload": "MAKE_RESERVATION_TOMORROW/RESERVATION/" + number
    }, {
        "content_type": "text",
        "title": "This week",
        "payload": "MAKE_RESERVATION_THIS_WEEK/RESERVATION/" + number
    }, {
        "content_type": "text",
        "title": "Next week",
        "payload": "MAKE_RESERVATION_NEXT_WEEK/RESERVATION/" + number
    }];
    return tools.sendFastResponse(participants, simpleMsg.replies, simpleMsg.title);
}
var persisteReservation = function(reservationFor, reservationWhen, participants) {
    return persistance.makeReservation(participants.receiver, reservationFor, reservationWhen, function() {
        return tools.sendTextMessage(participants, "\nPerfect, Your reservation have been considered, For more specifications about the reservation (preparing a birthday or a privat event for exemple) please contact us on our Number: 0096612122255");
    })
}
var prepareOrder = function(participants, orderedItem) {
    return persistance.preOrder(participants.receiver, orderedItem, function() {
        var simpleMsg = {};
        simpleMsg.title = " Great, that'd be in it's way in a moment, Where can we found you for delivery?";
        simpleMsg.replies = [{
            "content_type": "location",
        }];
        return tools.sendFastResponse(participants, simpleMsg.replies, simpleMsg.title);
    })
}
module.exports = {
    manageQuickReply: manageQuickReply
};
