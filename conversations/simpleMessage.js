'use strict'

var tools = require('../tools'),
    _ = require('underscore'),
    persistance = require('./bo/persistance'),
    conversations = [];
const translate = require('google-translate-api');

var importConversations = function(langCode) {
    conversations['Generic'] = require('./translate/' + langCode + '/generic.json');
    conversations['Greetings'] = require('./translate/' + langCode + '/greetings.json');
    conversations['Feelings'] = require('./translate/' + langCode + '/feelings.json');
    conversations['PersonalInfos'] = require('./translate/' + langCode + '/personalInfos.json');
    conversations['WorkInfos'] = require('./translate/' + langCode + '/workInfos.json');
    conversations['LinksAndArticles'] = require('./translate/' + langCode + '/linksAndArticles.json');
    conversations['Default'] = require('./translate/' + langCode + '/default.json');
}

var manageSimpleMessage = function(messageText, participants) {
    return persistance.getLanguageCode(participants.receiver, function(langCode) {
        importConversations(langCode);
        return messageText = translate(messageText, {
            to: langCode
        }).then(resTranslate => {
            var response;
            response = _.find(conversations['Generic'], function(item) {
                return resTranslate.text.toLowerCase().indexOf(item.key) !== -1
            });

            if (!response) {
                if (Boolean(_.find(conversations['Greetings'], function(item) {
                        return item.content === resTranslate.text.toLowerCase();
                    }))) {
                    response = _.sample(conversations['Greetings']);
                }
                if (!response) {
                    if (Boolean(_.find(conversations['Feelings'].inputs, function(item) {
                            return item.content === resTranslate.text.toLowerCase();
                        }))) {
                        response = _.sample(conversations['Feelings'].outputs);
                    }
                    if (!response) {
                        response = _.find(conversations['PersonalInfos'], function(item) {
                            return resTranslate.text.toLowerCase().indexOf(item.key) !== -1
                        });
                        if (!response) {
                            response = _.find(conversations['WorkInfos'], function(item) {
                                return resTranslate.text.toLowerCase().indexOf(item.key) !== -1
                            });
                            if (!response) {
                                response = _.find(conversations['LinksAndArticles'], function(item) {
                                    return resTranslate.text.toLowerCase().indexOf(item.key) !== -1
                                });
                                if (!response) {
                                    response = _.find(conversations['Default'], function(item) {
                                        return resTranslate.text.toLowerCase().indexOf(item.key) !== -1
                                    });
                                }
                            }
                        }
                    }
                }
            }
            if (response) {
                if (response.isComplex) {
                    if (response.template.element) {
                        //needs to add extentions
                        return tools.sendListMessage(participants, response.template);
                    } else {
                        return tools.sendGenericMessage(participants, response.template);
                    }
                    if (response.content) {
                        if (response.content instanceof Array) {
                            return tools.sendListOfTextMessages(participants, response.content);
                        } else
                            return tools.sendTextMessage(participants, response.content);
                    }
                } else {
                    if (response.content instanceof Array) {
                        return tools.sendListOfTextMessages(participants, response.content);
                    } else
                        return tools.sendTextMessage(participants, response.content);
                }
            } else {
                var response = _.sample(conversations['Default'])
                return tools.sendDefaultTextMessage(participants, response.content);
            }

        }).catch(err => {
            console.error(err);
        });
    })
}


module.exports = {
    manageSimpleMessage: manageSimpleMessage
};
