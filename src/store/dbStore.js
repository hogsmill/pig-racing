
const betFuns = require('./lib/bets.js')
const raceFuns = require('./lib/races.js')
const quizFuns = require('./lib/quizzes.js')
const stringFuns = require('./lib/stringFuns.js')

const { v4: uuidv4 } = require('uuid')

function _loadGroups(db, io) {
  db.collection('pigRacing').find().toArray(function(err, groupRes) {
    if (err) throw err
    if (groupRes.length) {
      io.emit('loadGroups', groupRes)
    }
  })
}

module.exports = {

  loadRaces: function(db, io, data, debugOn) {

    if (debugOn) { console.log('loadRaces') }

    const races = raceFuns.races()
    io.emit('loadRaces', races)
  },

  loadGroups: function(db, io, data, debugOn) {

    if (debugOn) { console.log('loadGroups') }
    _loadGroups(db, io)
  },

  setNextRace: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setNextRace', data) }

    db.collection('pigRacing').findOne({id: data.groupId}, function(err, res) {
      if (err) throw err
      if (res) {
        const currentRace = raceFuns.nextRace(res.races, res.include, res.currentRace)
        db.collection('pigRacing').updateOne({'_id': res._id}, {$set: {currentRace: currentRace}}, function(err, res) {
          if (err) throw err
          if (res) {
            _loadGroups(db, io)
          }
        })
      }
    })
  },

  restart: function(db, io, data, debugOn) {

    if (debugOn) { console.log('restart', data) }

    db.collection('pigRacing').findOne({id: data.groupId}, function(err, res) {
      if (err) throw err
      if (res) {
        const races = raceFuns.races()
        const punters = []
        for (let i = 0; i < res.punters.length; i++) {
          const punter = res.punters[i]
          punter.winnings = 0
          punter.quizScore = 0
          punter.marked = false
          punters.push(punter)
        }
        const quizConfig = res.quizConfig
        quizConfig.round = 1
        quizConfig.slide = 1
        const watching = {
          betting: 0,
          racing: 0
        }
        db.collection('pigRacing').updateOne({'_id': res._id}, {$set: {races: races, punters: punters, currentRace: -1, watching: watching, quizConfig: quizConfig}}, function(err, res) {
          if (err) throw err
          if (res) {
            _loadGroups(db, io)
          }
        })
      }
    })
  },

  bet: function(db, io, data, debugOn) {

    if (debugOn) { console.log('bet', data) }

    db.collection('pigRacing').findOne({id: data.groupId}, function(err, res) {
      if (err) throw err
      if (res) {
        const races = betFuns.bet(res.races, res.currentRace, data.pig, data.punter)
        db.collection('pigRacing').updateOne({'_id': res._id}, {$set: {races: races}}, function(err, res) {
          if (err) throw err
          if (res) {
            _loadGroups(db, io)
          }
        })
      }
    })
  },

  backToBetting: function(db, io, data, debugOn) {

    if (debugOn) { console.log('backToBetting', data) }

    db.collection('pigRacing').findOne({id: data.groupId}, function(err, res) {
      if (err) throw err
      if (res) {
        const races = []
        for (let i = 0; i < res.races.length; i++) {
          const race = res.races[i]
          if (i == res.currentRace) {
            race.pigsShown = true
          }
          races.push(race)
        }
        db.collection('pigRacing').updateOne({'_id': res._id}, {$set: {races: races}}, function(err, res) {
          if (err) throw err
          if (res) {
            _loadGroups(db, io)
            io.emit('backToBetting')
          }
        })
      }
    })
  },

  finish: function(db, io, data, debugOn) {

    if (debugOn) { console.log('finish', data) }

    db.collection('pigRacing').findOne({id: data.groupId}, function(err, res) {
      if (err) throw err
      if (res) {
        const races = []
        for (let i = 0; i < res.races.length; i++) {
          const race = res.races[i]
          if (i == res.currentRace) {
            race.hasRun = true
          }
          races.push(race)
        }
        const lastRace = raceFuns.lastRace(res.races, res.races[res.currentRace])
        const punters = betFuns.calculateWinnings(res.punters, races, lastRace, res.doublePointsOnLastRace)
        db.collection('pigRacing').updateOne({'_id': res._id}, {$set: {races: races, punters: punters}}, function(err, res) {
          if (err) throw err
          if (res) {
            _loadGroups(db, io)
            io.emit('finish')
          }
        })
      }
    })
  },

  setQuizSlide: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setQuizSlide', data) }

    db.collection('pigRacing').findOne({id: data.groupId}, function(err, res) {
      if (err) throw err
      if (res) {
        db.collection('pigRacing').updateOne({'_id': res._id}, {$set: {'quizConfig.slide': data.slide}}, function(err, res) {
          if (err) throw err
          if (res) {
            _loadGroups(db, io)
          }
        })
      }
    })
  },

  submitAnswer: function(db, io, data, debugOn) {

    if (debugOn) { console.log('submitAnswer', data) }

    db.collection('pigRacing').findOne({id: data.groupId}, function(err, res) {
      if (err) throw err
      if (res) {
        const punters = []
        for (let i = 0; i < res.punters.length; i++) {
          const punter = res.punters[i]
          if (punter.id == data.punterId) {
            const answers = []
            if (punter.quizAnswers) {
              for (let j = 0; j < punter.quizAnswers.length; j++) {
                if (punter.quizAnswers[j].slide != data.slide) {
                  answers.push(punter.quizAnswers[j])
                }
              }
            }
            answers.push({
              slide: data.slide,
              answer: data.answer
            })
            punter.quizAnswers = answers
          }
          punters.push(punter)
        }
        db.collection('pigRacing').updateOne({'_id': res._id}, {$set: {punters: punters}}, function(err, res) {
          if (err) throw err
          if (res) {
            _loadGroups(db, io)
          }
        })
      }
    })
  },

  finishQuizRound: function(db, io, data, debugOn) {

    if (debugOn) { console.log('finishQuizRound', data) }

    db.collection('pigRacing').findOne({id: data.groupId}, function(err, res) {
      if (err) throw err
      if (res) {
        const quizConfig = res.quizConfig
        quizConfig.round = quizConfig.round + 1
        quizConfig.slide = 1
        db.collection('pigRacing').updateOne({'_id': res._id}, {$set: {quizConfig: quizConfig}}, function(err, res) {
          if (err) throw err
          if (res) {
           _loadGroups(db, io)
          }
        })
      }
    })
  },

  addGroup: function(db, io, data, debugOn) {

    if (debugOn) { console.log('addGroup', data) }

    const res = {
      id: uuidv4(),
      group: data.group,
      punters: [],
      current: false,
      include: raceFuns.include(),
      races: raceFuns.races(),
      currentRace: -1,
      watching: {
        betting: 0,
        racing: 0
      },
      quiz: false,
      quizConfig: quizFuns.initialConfig()
    }
    db.collection('pigRacing').insertOne(res, function(err, res) {
      if (err) throw err
      if (res) {
        _loadGroups(db, io)
      }
    })
  },

  setMaxPunters: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setMaxPunters', data) }

    db.collection('pigRacing').findOne({id: data.groupId}, function(err, res) {
      if (err) throw err
      if (res) {
        res.maxPunters = data.value
        db.collection('pigRacing').updateOne({'_id': res._id}, {$set: {maxPunters: data.value}}, function(err, res) {
          if (err) throw err
          if (res) {
            _loadGroups(db, io)
          }
        })
      }
    })
  },

  setGroup: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setGroup', data) }

    db.collection('pigRacing').find().toArray(function(err, res) {
      if (err) throw err
      if (res.length) {
        for (let r = 0; r < res.length; r++) {
          let current = false
          if (res[r].id == data.id) {
            current = !res[r].current
          }
          const quizConfig = res.quizConfig ? res.quizConfig : quizFuns.initialConfig()
          db.collection('pigRacing').updateOne({'_id': res[r]._id}, {$set: {current: current, quizConfig: quizConfig}}, function(err, res) {
            if (err) throw err
            if (res) {
              _loadGroups(db, io)
            }
          })
        }
      }
    })
  },

  deleteGroup: function(db, io, data, debugOn) {

    if (debugOn) { console.log('deleteGroup', data) }

    db.collection('pigRacing').deleteOne({id: data.id}, function(err, res) {
      if (err) throw err
      if (res) {
        _loadGroups(db, io)
      }
    })
  },

  setGroupDoublePointsOnLastRace: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setGroupDoublePointsOnLastRace', data) }

    db.collection('pigRacing').findOne({id: data.id}, function(err, res) {
      if (err) throw err
      if (res) {
        const doublePointsOnLastRace = !res.doublePointsOnLastRace
        db.collection('pigRacing').updateOne({'_id': res._id}, {$set: {doublePointsOnLastRace: doublePointsOnLastRace}}, function(err, res) {
          if (err) throw err
          if (res) {
            _loadGroups(db, io)
          }
        })
      }
    })
  },

  setGroupQuiz: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setGroupQuiz', data) }

    db.collection('pigRacing').findOne({id: data.id}, function(err, res) {
      if (err) throw err
      if (res) {
        const showQuiz = !res.showQuiz
        db.collection('pigRacing').updateOne({'_id': res._id}, {$set: {showQuiz: showQuiz}}, function(err, res) {
          if (err) throw err
          if (res) {
            _loadGroups(db, io)
          }
        })
      }
    })
  },

  setGroupCombineScores: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setGroupCombineScores', data) }

    db.collection('pigRacing').findOne({id: data.id}, function(err, res) {
      if (err) throw err
      if (res) {
        const combineScores = !res.combineScores
        db.collection('pigRacing').updateOne({'_id': res._id}, {$set: {combineScores: combineScores}}, function(err, res) {
          if (err) throw err
          if (res) {
            _loadGroups(db, io)
          }
        })
      }
    })
  },

  addPunter: function(db, io, data, debugOn) {

    if (debugOn) { console.log('addPunter', data) }

    db.collection('pigRacing').findOne({id: data.groupId}, function(err, res) {
      if (err) throw err
      if (res) {
        const punters = res.punters
        punters.push({
          id: uuidv4(),
          name: data.punter,
          include: true,
          initials: stringFuns.initials(data.punter),
          winnings: 0,
          quizAnswers: []
        })
        db.collection('pigRacing').updateOne({'_id': res._id}, {$set: {punters: punters}}, function(err, res) {
          if (err) throw err
          if (res) {
            _loadGroups(db, io)
          }
        })
      }
    })
  },

  deletePunter: function(db, io, data, debugOn) {

    if (debugOn) { console.log('deletePunter', data) }

    db.collection('pigRacing').findOne({id: data.groupId}, function(err, res) {
      if (err) throw err
      if (res) {
        const punters = []
        for (let i = 0; i < res.punters.length; i++) {
          if (res.punters[i].id != data.id) {
            punters.push(res.punters[i])
          }
        }
        db.collection('pigRacing').updateOne({'_id': res._id}, {$set: {punters: punters}}, function(err, res) {
          if (err) throw err
          if (res) {
            _loadGroups(db, io)
          }
        })
      }
    })
  },

  toggleIncludePunter: function(db, io, data, debugOn) {

    if (debugOn) { console.log('toggleIncludePunter', data) }

    db.collection('pigRacing').findOne({id: data.groupId}, function(err, res) {
      if (err) throw err
      if (res) {
        const punters = []
        for (let i = 0; i < res.punters.length; i++) {
          if (res.punters[i].id == data.id) {
            res.punters[i].include = !res.punters[i].include
          }
          punters.push(res.punters[i])
        }
        db.collection('pigRacing').updateOne({'_id': res._id}, {$set: {punters: punters}}, function(err, res) {
          if (err) throw err
          if (res) {
            _loadGroups(db, io)
          }
        })
      }
    })
  },

  includeRace: function(db, io, data, debugOn) {

    if (debugOn) { console.log('includeRace', data) }

    db.collection('pigRacing').findOne({id: data.groupId}, function(err, res) {
      if (err) throw err
      if (res) {
        const include = res.include
        include[data.race] = !res.include[data.race]
        db.collection('pigRacing').updateOne({'_id': res._id}, {$set: {include: include}}, function(err, res) {
          if (err) throw err
          if (res) {
            _loadGroups(db, io)
          }
        })
      }
    })
  },

  setNoOfRounds: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setNoOfRounds', data) }

    db.collection('pigRacing').findOne({id: data.groupId}, function(err, res) {
      if (err) throw err
      if (res) {
        const quizConfig = res.quizConfig
        let rounds = quizConfig.rounds
        if (rounds.length < data.noOfRounds) {
          for (let i = rounds.length; i < data.noOfRounds; i++) {
            rounds.push([])
          }
        } else if (rounds.length > data.noOfRounds) {
          rounds = rounds.slice(0, data.noOfRounds)
        }
        quizConfig.noOfRounds = data.noOfRounds
        quizConfig.rounds = rounds
        db.collection('pigRacing').updateOne({'_id': res._id}, {$set: {quizConfig: quizConfig}}, function(err, res) {
          if (err) throw err
          if (res) {
            _loadGroups(db, io)
          }
        })
      }
    })
  },

  loadSlides: function(db, io, debugOn) {

    if (debugOn) { console.log('loadSlides') }

    io.emit('loadSlides', quizFuns.slides())
  },

  putSlideInRound: function(db, io, data, debugOn) {

    if (debugOn) { console.log('putSlideInRound', data) }

    db.collection('pigRacing').findOne({id: data.groupId}, function(err, res) {
      if (err) throw err
      if (res) {
        const rounds = []
        for (let i = 0; i < res.quizConfig.rounds.length; i++) {
          let round
          if (i == data.round - 1) {
            round = quizFuns.addToRound(data.slide, res.quizConfig.rounds[i] )
          } else {
            round = quizFuns.deleteFromRound(data.slide, res.quizConfig.rounds[i] )
          }
          rounds.push(round)
        }
        db.collection('pigRacing').updateOne({'_id': res._id}, {$set: {'quizConfig.rounds': rounds}}, function(err, res) {
          if (err) throw err
          if (res) {
            _loadGroups(db, io)
          }
        })
      }
    })
  },

  deleteSlideFromRound: function(db, io, data, debugOn) {

    if (debugOn) { console.log('deleteSlideFromRound', data) }

    db.collection('pigRacing').findOne({id: data.groupId}, function(err, res) {
      if (err) throw err
      if (res) {
        const rounds = []
        for (let i = 0; i < res.quizConfig.rounds.length; i++) {
          const round = quizFuns.deleteFromRound(data.slide, res.quizConfig.rounds[i] )
          rounds.push(round)
        }
        db.collection('pigRacing').updateOne({'_id': res._id}, {$set: {'quizConfig.rounds': rounds}}, function(err, res) {
          if (err) throw err
          if (res) {
            _loadGroups(db, io)
          }
        })
      }
    })
  },

  setAnswerCorrect: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setAnswerCorrect', data) }

    db.collection('pigRacing').findOne({id: data.groupId}, function(err, res) {
      if (err) throw err
      if (res) {
        const punters = []
        for (let i = 0; i < res.punters.length; i++) {
          const punter = res.punters[i]
          if (punter.id == data.punterId) {
            const answers = []
            for (j = 0; j < punter.quizAnswers.length; j++) {
              const answer = punter.quizAnswers[j]
              if (answer.slide.number == data.slide) {
                answer.slide.correct = data.value
              }
              answers.push(answer)
            }
            punter.quizAnswers = answers
          }
          let score = 0
          for (let k = 0; k < punter.quizAnswers.length; k++) {
            if (punter.quizAnswers[k].slide.correct) {
              score = score + 1
            }
          }
          punter.quizScore = score
          punters.push(punter)
        }
        db.collection('pigRacing').updateOne({'_id': res._id}, {$set: {punters}}, function(err, res) {
          if (err) throw err
          if (res) {
            _loadGroups(db, io)
          }
        })
      }
    })
  },

  setAsMarked: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setAsMarked', data) }

    db.collection('pigRacing').findOne({id: data.groupId}, function(err, res) {
      if (err) throw err
      if (res) {
        const punters = []
        for (let i = 0; i < res.punters.length; i++) {
          const punter = res.punters[i]
          if (punter.id == data.punterId) {
            punter.marked = true
          }
          punters.push(punter)
        }
        db.collection('pigRacing').updateOne({'_id': res._id}, {$set: {punters}}, function(err, res) {
          if (err) throw err
          if (res) {
            _loadGroups(db, io)
          }
        })
      }
    })
  }

}
