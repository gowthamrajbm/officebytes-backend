const mongoose = require('mongoose');

const Tournament = require('../models/tournament.model');

exports.create_tournament = (req, res, next) => {
    const userId = req.userData.userId;

    const tournament = new Tournament({
        _id: new mongoose.Types.ObjectId(),
        created_at: Date.now(),
        created_by: userId,
        game: req.body.game_id,
        pricing: req.body.pricing,
        game_meta: req.body.game_meta,
        start_time: req.body.start_time,
        closing_time: req.body.closing_time,
        max_people: req.body.max_people,
        min_people: req.body.min_people,
        participents: [],
        price_detail: req.body.price_detail,
        tournament_description: req.body.tournament_description,
        terms_and_condition: req.body.terms_and_condition
    });


    tournament
        .save()
        .then((result) => {
            return res.status(201).json({
                success: true,
                response: result,
            })
        })
        .catch(() => {
            return res.status(500).json({
                success: false,
                response: err
            });
        })
}

exports.get_upcoming_tournament_list = (req, res, next) => {
    const myUserId = req.userData.userId;
    const gameId = req.query.game_id;
    const completed = req.query.completed;
    const query = {};
    
    if (gameId) {
        query.game = gameId;
    }

    if (completed == 1) {
        query.completed = true;
    }

    console.log('query', query)
    Tournament.find(query)
        .select('game completed game_meta start_time max_people participents')
        .populate('game', 'name wallpaper_url')
        .populate('participents.participation', 'user')
        .exec()
        .then((tournaments) => {
            console.log('tournaments', tournaments);
            const newTournaments = [];
            for (let i = 0; i < tournaments.length; i++) {
                const tournament = tournaments[i];
                const participents = tournament.participents;
                let participated = false;
                let participatedId;
                participents.forEach((item) => {
                    if (item.participation.user.equals(myUserId)) {
                        participated = true;
                        participatedId = item.participation._id;
                    }
                })

                newTournaments.push(Object.assign(tournament, { participents: undefined, is_participated: participated, user_participation_id: participatedId }));
            }

            console.log('newTournaments', newTournaments);

            return res.status(201).json({
                success: true,
                response: newTournaments
            })
        })
        .catch((err) => {
            return res.status(201).json({
                success: false,
                response: err
            })
        })
}

exports.get_tournament_detail = (req, res, next) => {
    Tournament.find({ _id: req.params.id })
        .populate('game')
        .exec()
        .then((tournaments) => {
            return res.status(201).json({
                success: true,
                response: tournaments[0]
            })
        })
        .catch((err) => {
            return res.status(201).json({
                success: false,
                response: err
            })
        })
}

exports.attach_tournament = (req, res, next) => {
    Tournament.find({ _id: req.body.tournament_id || req.tournament_id })
        .populate('game')
        .populate('participents.participation')
        .exec()
        .then((tournaments) => {
            req.tournament = tournaments[0];
            next();
        })
        .catch((err) => {
            return res.status(201).json({
                success: false,
                response: err
            })
        })
}

exports.add_participent = (req, res, next) => {
    const tournamentId = req.tournament_id;
    const participationId = req.participate._id;

    Tournament.update({ _id: tournamentId }, { $push: { "participents": { participation: participationId } } })
        .exec()
        .then(() => {
            next();
        })
        .catch((error) => {
            return res.status(200).json({
                success: false,
                response: error
            });
        })
}

exports.finish_tournament = (req, res, next) => {
    next();
}

exports.set_tournament_credentials = (req, res, next) => {
    next();
}
