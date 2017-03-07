'use strict'

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/abarribot');

var UserSchema = mongoose.Schema({
    id: String,
    lang: String,
    startedChatAt: {
        type: Date,
        default: Date.now
    }
});
var ReservationSchema = mongoose.Schema({
    numberPersons: Number,
    estimateDay: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    madeAt: {
        type: Date,
        default: Date.now
    }
});
var OrderSchema = mongoose.Schema({
    item: String,
    address: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    madeAt: {
        type: Date,
        default: Date.now
    }
});
var User = mongoose.model('User', UserSchema);
var Reservation = mongoose.model('Reservation', ReservationSchema);
var Order = mongoose.model('Order', OrderSchema);

var initUser = function(userId, callback) {

    var user = new User({
        id: userId
    });
    return user.save(function(err, user) {
        if (!err) {
            callback()
        } else {
            return console.error(err);
        }
    });
}

var changeLanguage = function(userId, language_code, callback) {

    return User.findOneAndUpdate({
        id: userId
    }, {
        $set: {
            lang: language_code
        }
    }).exec(function(err, user) {
        if (!err) {
            callback()
        } else {
            return console.error(err);
        }
    });
}
var getLanguageCode = function(userId, callback) {

    return User.find({
        id: userId
    }).exec(function(err, user) {
        if (!err) {
            callback(user[0].lang)
        } else {
            return console.error(err);
        }
    });
}
var makeReservation = function(userId, reservationFor, reservationWhen, callback) {

    return User.find({
        id: userId
    }).exec(function(err, user) {
        if (!err) {

            var reservation = new Reservation({
                numberPersons: reservationFor,
                estimateDay: reservationWhen,
                user: user._id
            });
            return reservation.save(function(err, user) {
                if (!err) {
                    callback()
                } else {
                    return console.error(err);
                }
            });
        } else {
            return console.error(err);
        }
    })
}

var preOrder = function(userId, item, callback) {
    return User.find({
        id: userId
    }).exec(function(err, user) {
        if (!err) {
            var order = new Order({
                item: item,
                user: user._id
            });
            return order.save(function(err, doc) {
                if (!err) {
                    callback()
                } else {
                    return console.error(err);
                }
            });
        } else {
            return console.error(err);
        }
    })
}
var setOrderDelivery = function(userId, address, callback) {
    return User.find({
        id: userId
    }).exec(function(err, profil) {
        if (!err) {
            return Order.findOneAndUpdate({
                user: profil._id
            }, {
                $set: {
                    address: address
                }
            }).exec(function(err, order) {
                if (!err) {
                    callback()
                } else {
                    return console.error(err);
                }
            });
        } else {
            return console.error(err);
        }
    })
}
module.exports = {
    initUser: initUser,
    changeLanguage: changeLanguage,
    getLanguageCode: getLanguageCode,
    makeReservation: makeReservation,
    preOrder: preOrder,
    setOrderDelivery: setOrderDelivery
};
