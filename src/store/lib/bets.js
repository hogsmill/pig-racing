
function removeBet(bets, punter) {
  const newBets = []
  for (let i = 0; i < bets.length; i++) {
    if (bets[i].id != punter.id) {
      newBets.push(bets[i])
    }
  }
  return newBets
}

function placePoints(place) {
  let points = 0
  switch(place) {
    case 1:
      points = 10
      break
    case 2:
      points = 6
      break
    case 3:
      points = 3
      break
    case 4:
      points = 1
      break
  }
  return points
}

module.exports = {

  bet: function(races, currentRace, pig, punter) {
    const newRaces = []
    for (let i = 0; i < races.length; i++) {
      const race = races[i]
      if (i == currentRace) {
        const pigs = []
        for (let j = 0; j < race.pigs.length; j++) {
          const racePig = race.pigs[j]
          const bets = removeBet(racePig.bets, punter)
          if (racePig.name == pig.name) {
            bets.push(punter)
          }
          racePig.bets = bets
          pigs.push(racePig)
        }
        race.pigs = pigs
      }
      newRaces.push(race)
    }
    return newRaces
  },

  calculateWinnings: function(punters, races) {
    const newPunters = []
    for (let i = 0; i < punters.length; i++) {
      const punter = punters[i]
      let winnings = 0
      for (let j = 0; j < races.length; j++) {
        if (races[j].hasRun) {
          const race = races[j]
          for (let k = 0; k < race.pigs.length; k++) {
            const pig = race.pigs[k]
            const points = placePoints(pig.place)
            for (let l = 0; l < pig.bets.length; l++) {
              if (pig.bets[l].id == punter.id) {
                winnings = winnings + points
              }
            }
          }
        }
      }
      punter.winnings = winnings
      newPunters.push(punter)
    }
    return newPunters
  },
}
