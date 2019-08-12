const axios = require('axios');
const mongoose = require('mongoose');

const Wallet = require('../models/wallet.model');
const WalletTransaction = require('../models/walletTransactions.model');

exports.create_wallet = (req, res, next) => {
    const wallet = new Wallet({
        _id: new mongoose.Types.ObjectId(),
    })

    wallet
        .save()
        .then((result) => {
            req.wallet = result._id;
            next();
        })
        .catch((err) => {
            return res.status(200).json({
                success: false,
                response: err
            });
        })
    return;
}

exports.get_transactions = (req, res, next) => {
    const userId = req.userData.userId;

    WalletTransaction.find({ user: userId })
        .exec()
        .then((response) => {
            res.status(200).json({
                success: true,
                response: response
            });
        })
        .catch((err) => {
            return res.status(200).json({
                success: false,
                response: err
            });
        })
}

exports.create_wallet_transaction = (req, res, next) => {
    const userId = req.userData.userId;
    const walletTransaction = new WalletTransaction({
        _id: new mongoose.Types.ObjectId(),
        user: userId,
        amount: req.body.amount
    })

    walletTransaction
        .save()
        .then((result) => {
            console.log('wallllet', result);
            req.walletTransaction = result;
            next();
        })
}

exports.attach_wallet_transaction = (req, res, next) => {
    const walletTransactionId = req.body.order_id;

    WalletTransaction.findOne({ _id: walletTransactionId })
        .exec()
        .then((transaction) => {
            if (transaction.status == 'PENDING' || transaction.status == 'pending') {
                req.walletTransaction = transaction;
                next();
            } else {
                return res.status(200).json({
                    success: false,
                    response: 'Alredy served'
                });
            }
        })
        .catch((err) => {
            return res.status(200).json({
                success: false,
                response: err
            });
        })
}

exports.verify_transaction = (req, res, next) => {
    const walletTransactionId = req.walletTransaction._id;
    const walletId = req.user.wallet._id;
    const currentWalletCashBalance = req.user.wallet.cash_balance;
    const params = req.VERIFY_PARAMS;
    axios.post('https://securegw-stage.paytm.in/order/status', params, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((response) => {
        const responsedata = response.data;
        if (responsedata.STATUS == "TXN_SUCCESS") {
            WalletTransaction.update({ _id: walletTransactionId }, { $set: { "server_response": responsedata, "status": "TXN_SUCCESS" } })
                .exec()
                .then(() => {
                    Wallet.update({ _id: walletId }, { $set: { cash_balance: parseFloat(parseFloat(currentWalletCashBalance) + parseFloat(responsedata.TXNAMOUNT)) } })
                        .exec()
                        .then((walletRes) => {
                            return res.status(200).json({
                                success: true,
                                response: walletRes
                            });
                        })
                        .catch((err) => {
                            return res.status(200).json({
                                success: false,
                                response: err
                            })
                        })

                })
                .catch((err) => {
                    return res.status(200).json({
                        success: false,
                        response: err
                    })
                })
        }
    }).catch((error) => {
        return res.status(200).json({
            success: false,
            response: error
        });
    })
}