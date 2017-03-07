'use strict'

var tools = require('../tools'),
    emoji = require('node-emoji'),
    persistance = require('./bo/persistance');

var manageSimplePayload = function(payload, participants) {
    var simpleMsg = {};
    simpleMsg.title = "";
    simpleMsg.replies = [];
    switch (String(payload)) {
        case "GET_STARTED_PAYLOAD":
            {
              return persistance.initUser(participants.receiver, function(){
                      simpleMsg.title = "First, Let's choose the language you'll feel confortable with chatting with me " + emoji.random().emoji;
                      simpleMsg.replies = [{
                              "content_type": "text",
                              "title": "English",
                              "payload": "GET_STARTED_CHANGE_LANGUAGE_TO_ENGLISH"
                          },
                          {
                              "content_type": "text",
                              "title": "Arabic",
                              "payload": "GET_STARTED_CHANGE_LANGUAGE_TO_ARABIC"
                          },
                          {
                              "content_type": "text",
                              "title": "French",
                              "payload": "GET_STARTED_CHANGE_LANGUAGE_TO_FRENCH"
                          },
                          {
                              "content_type": "text",
                              "title": "Spanish",
                              "payload": "GET_STARTED_CHANGE_LANGUAGE_TO_SPANISH"
                          }
                      ];
                      return tools.sendFastResponse(participants, simpleMsg.replies, simpleMsg.title);
              })
                break;
            }
        case "CHANGE_LANGUAGE_MENU_PAYLOAD":
            {
                simpleMsg.title = "Pick a language:";
                simpleMsg.replies = [{
                        "content_type": "text",
                        "title": "English",
                        "payload": "CHANGE_LANGUAGE_TO_ENGLISH"
                    },
                    {
                        "content_type": "text",
                        "title": "Arabic",
                        "payload": "CHANGE_LANGUAGE_TO_ARABIC"
                    },
                    {
                        "content_type": "text",
                        "title": "French",
                        "payload": "CHANGE_LANGUAGE_TO_FRENCH"
                    },
                    {
                        "content_type": "text",
                        "title": "Spanish",
                        "payload": "CHANGE_LANGUAGE_TO_SPANISH"
                    }
                ];
                return tools.sendFastResponse(participants, simpleMsg.replies, simpleMsg.title);
                break;
            }
        case "RESERVATION_MENU_PAYLOAD":
            {
                simpleMsg.title = "Of course, you'd like to reserve a table for how match people? ";
                simpleMsg.replies = [{
                    "content_type": "text",
                    "title": "2 people",
                    "payload": "MAKE_RESERVATION_2"
                }, {
                    "content_type": "text",
                    "title": "4 people",
                    "payload": "MAKE_RESERVATION_4"
                }, {
                    "content_type": "text",
                    "title": "6 people",
                    "payload": "MAKE_RESERVATION_6"
                }, {
                    "content_type": "text",
                    "title": "7 or more people",
                    "payload": "MAKE_RESERVATION_MORE_7"
                }];
                return tools.sendFastResponse(participants, simpleMsg.replies, simpleMsg.title);
                break;
            }
        case "ORDER_MENU_PAYLOAD":
            {
                simpleMsg.title = "Hi Sir, What would you like to order?" + emoji.random().emoji;
                simpleMsg.replies = [{
                    "content_type": "text",
                    "title": "Pizza",
                    "payload": "ORDER_PIZZA"
                }, {
                    "content_type": "text",
                    "title": "Sandwich, Burger or Panini",
                    "payload": "ORDER_SANDWICH"
                }, {
                    "content_type": "text",
                    "title": "Salade",
                    "payload": "ORDER_SALADE"
                }, {
                    "content_type": "text",
                    "title": "Breakfast",
                    "payload": "ORDER_BREAKFAST"
                }];
                return tools.sendFastResponse(participants, simpleMsg.replies, simpleMsg.title);
                break;
            }
    }
}

module.exports = {
    manageSimplePayload: manageSimplePayload
};
