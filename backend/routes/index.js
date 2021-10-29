var express = require('express');
var router = express.Router();
var chance = require('chance').Chance();
var path = require('path')

const low = require('lowdb')
const JSONFile = require('lowdb/adapters/FileSync')
const adapter = new JSONFile(path.join(__dirname,'../data/db.json'))
const db = new low(adapter)

function getQuiz(quizid){
  const quiz = db.get('quizzes').find({id:parseInt(quizid)}).value()
  return quiz
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("index.html");
});
router.get('/random', function (req, res, next) {
  var id = chance.natural({min:1,max:db.get('quizzes')
  .size()
  .value()})
  res.json(getQuiz(id))
})
router.get('/:id', function (req, res, next) {
  res.json(getQuiz(req.params.id))
})
module.exports = router;
