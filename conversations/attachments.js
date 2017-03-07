'use strict'

var tools = require('../tools'),
    rp = require('request-promise'),
    googlemapsapikey = 'AIzaSyCbAqXRc_YWZbQG9urM5YJa_-7iBZRXhng',
    persistance = require('./bo/persistance');

var manageAttachments = function(attachments, participants) {
    if (attachments[0].type === "location") {
        var options = {
            uri: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + attachments[0].payload.coordinates.lat + ',' + attachments[0].payload.coordinates.long + '&key=' + googlemapsapikey,
            json: true // Automatically parses the JSON string in the response
        };

        return rp(options)
            .then(function(body) {
                var address = body.results[0].formatted_address;
                return persistance.setOrderDelivery(participants.receiver, address, function() {
                    return tools.sendTextMessage(participants, "The delivery will be sent in a moment to " + address);
                })
            });
    } else {
        return tools.sendTextMessage(participants, "Can you please not?");
    }
}


module.exports = {
    manageAttachments: manageAttachments
};
