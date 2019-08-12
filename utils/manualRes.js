const express = require("express");

let result = null;

const send = res => {
  result = res;
};

module.exports = { send: result => send(result), result: result };
