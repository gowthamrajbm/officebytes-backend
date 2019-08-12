const moment = require('moment');
const mongoose = require('mongoose');

const Game = require('../class/game.class');

const ParticipationRequest = require('../models/participationRequest.model');
const Tournament = require('../models/tournament.model');

exports.get_participation = (req, res, next) => {
    const participationId = req.params.id || req.participation_id;

    ParticipationRequest.findById(participationId)
        .populate({
            path: 'user',
            populate: {
                path: 'wallet',
                model: 'Wallet'
            }
        })
        .populate({
            path: 'tournament',
            populate: {
                path: 'game'
            }
        })
        .populate('profile')
        .exec()
        .then((response) => {
            return res.status(201).json({
                success: true,
                response: response,
            })
        })
        .catch((err) => {
            return res.status(200).json({
                success: false,
                response: 'Something went wrong'
            });
        })
}

exports.request_participate = (req, res, next) => {
    const tournamentId = req.body.tournament_id;
    const amount = Game.calculateEntryFee(req.tournament.pricing)
    const userId = req.userData.userId;
    const profileId = req.body.profile_id;

    const participationRequest = ParticipationRequest({
        _id: new mongoose.Types.ObjectId(),
        user: userId,
        tournament: tournamentId,
        profile: profileId,
        amount,
    })

    participationRequest
        .save()
        .then((response) => {
            req.participation_id = response._id;
            next();
        })
        .catch((err) => {
            return res.status(200).json({
                success: false,
                response: 'Something went wrong'
            });
        })
    return;
}

exports.attach_participate = (req, res, next) => {
    const participationId = req.params.id;
    ParticipationRequest.find({ _id: participationId })
        .exec()
        .then((result) => {
            req.tournament_id = result[0].tournament;
            req.participate = result[0];
            next();
        })
        .catch((err) => {
            return res.status(200).json({
                success: false,
                response: 'attach participate Something went wrong'
            });
        })
}

exports.complete_participation = (req, res, next) => {
    const userId = req.user._id;
    const amount = req.participate.amount;
    const walletBalance = req.user.wallet.cash_balance;
    const updatedWallet = walletBalance - amount;
    const tournament = req.tournament;
    const participents = tournament.participents || [];

    for (let i = 0; i < participents.length; i++) {
        const item = participents[i];
        if (item.participation.user.equals(userId)) {
            res.status(200).json({
                success: false,
                response: 'Already participated'
            });
            break;
        }
    }

    if (walletBalance >= amount) {
        //have enought balance
        req.updatedWallet = updatedWallet;
        next();
    } else {
        return res.status(200).json({
            success: false,
            response: 'Not enough wallet money'
        });
    }
}