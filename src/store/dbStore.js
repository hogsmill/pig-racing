
const betFuns = require('./lib/bets.js')
const raceFuns = require('./lib/races.js')
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
          punters.push(punter)
        }
        db.collection('pigRacing').updateOne({'_id': res._id}, {$set: {races: races, punters: punters, currentRace: -1}}, function(err, res) {
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
        const punters = betFuns.calculateWinnings(res.punters, races)
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

  addGroup: function(db, io, data, debugOn) {

    if (debugOn) { console.log('addGroup', data) }

    const res = {
      id: uuidv4(),
      group: data.group,
      punters: [],
      current: false,
      include: raceFuns.include(),
      races: raceFuns.races(),
      currentRace: -1
    }
    db.collection('pigRacing').insertOne(res, function(err, res) {
      if (err) throw err
      if (res) {
        _loadGroups(db, io)
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
          db.collection('pigRacing').updateOne({'_id': res[r]._id}, {$set: {current: current}}, function(err, res) {
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

  addPunter: function(db, io, data, debugOn) {

    if (debugOn) { console.log('addPunter', data) }

    db.collection('pigRacing').findOne({id: data.groupId}, function(err, res) {
      if (err) throw err
      if (res) {
        const punters = res.punters
        punters.push({
          id: uuidv4(),
          name: data.punter,
          initials: stringFuns.initials(data.punter),
          winnings: 0
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
  }

}
