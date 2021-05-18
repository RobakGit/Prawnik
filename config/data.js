const mongoose = require("mongoose");


// Użytkownicy

const User = require("../models/User");

function listUsers(cb) {

    User.find({}).sort({imie:1}).exec(function (err, users) {

        if (err){
            cb(err);
        } else{
            cb(null, users);
        }

    });

}

function deleteUser(id, cb) {

    User.findByIdAndRemove(id).exec(function (err, user) {

        if (err){
            cb(err);
        } else{
            cb(null, user);
        }

    });

}

function updateUser(userData, cb) {

    var id = userData.id;

    delete userData.id;

    User.findByIdAndUpdate(id, userData).exec(function (err, user) {

        if (err){
            cb(err);
        } else{
            cb(null, user);
        }

    });

}

// Sprawy

const Case = require("../models/Case");

function listCases(cb) {

    Case.find({}).sort({$natural:-1}).exec(function (err, cases) {

        if (err){
            cb(err);
        } else{
            cb(null, cases);
        }

    });

}

function listCasesBy(id, cb) {

    Case.find({id_prawnika : id}).exec(function (err, cases) {

        if (err){
            cb(err);
        } else{
            cb(null, cases);
        }

    });

}

function findCase(id, cb) {

    Case.findById(id).exec(function (err, cases) {

        if (err){
            cb(err);
        } else{
            cb(null, cases);
        }

    });

}

function updateCase(caseData, cb) {

    var id = caseData.id;

    delete caseData.id;

    Case.findByIdAndUpdate(id, caseData).exec(function (err, cases) {

        if (err){
            cb(err);
        } else{
            cb(null, cases);
        }

    });

}

//    Wiadomości

const Message = require("../models/Message");

function listReceivedMessagesBy(id, admin, cb){

    Message.find({odbiorca_id : { $in: [id, admin]}}).sort({$natural:-1}).exec(function (err, messages) {

        if (err){
            cb(err);
        } else{
            cb(null, messages);
        }

    });

}

function listSendedMessagesBy(id, admin, cb){

    Message.find({nadawca_id : { $in: [id, admin]}}).sort({$natural:-1}).exec(function (err, messages) {

        if (err){
            cb(err);
        } else{
            cb(null, messages);
        }

    });

}

function findMessage(id, cb){

    Message.findById(id).exec(function (err, messages) {

        if (err){
            cb(err);
        } else{
            cb(null, messages);
        }

    });

}

function updateMessage(messageData, cb) {

    var id = messageData.id;

    delete messageData.id;

    Message.findByIdAndUpdate(id, messageData).exec(function (err, messages) {

        if (err){
            cb(err);
        } else{
            cb(null, messages);
        }

    });

}

function deleteMessages(id, cb) {

    Message.deleteMany(id).exec(function (err, message) {

        if (err){
            cb(err);
        } else{
            cb(null, message);
        }

    });

}

function hideMessages_n(id, cb) {

    Message.updateMany(id, { $set: { visiblity_n: false }}).exec(function (err, message) {

        if (err){
            cb(err);
        } else{
            cb(null, message);
        }

    });

}

function hideMessages_o(id, cb) {

    Message.updateMany(id, { $set: { visiblity_o: false }}).exec(function (err, message) {

        if (err){
            cb(err);
        } else{
            cb(null, message);
        }

    });

}

module.exports = {
	listUsers: listUsers,
	deleteUser: deleteUser,
    updateUser: updateUser,
    listCases: listCases,
    listCasesBy: listCasesBy,
    findCase: findCase,
    updateCase: updateCase,
    listReceivedMessagesBy: listReceivedMessagesBy,
    listSendedMessagesBy: listSendedMessagesBy,
    findMessage: findMessage,
    updateMessage: updateMessage,
    deleteMessages: deleteMessages,
    hideMessages_n: hideMessages_n,
    hideMessages_o: hideMessages_o
};