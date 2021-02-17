
const slides = [
  {number: 1, title: 'Beatles', answer: 'The Beatles (John, Paul, George, Ringo)'},
  {number: 2, title: 'Races', answer: 'The horse racing classics (Oaks, Derby, National, Gold Cup)'},
  {number: 3, title: 'Detectives', answer: 'TV Detectives (Frost, Magnus, Morse, Endeavour)'},
  {number: 4, title: 'Kingston', answer: 'Kingston landmarks (Kingfisher, Out of Order (phone boxes), Tiffin (school), Apple Market)'},
  {number: 5, title: 'Trees', answer: 'Trees (Hazel, Rowan, Ash, Cherry, Olive, Lime)'},
  {number: 6, title: 'Monoploy', answer: 'Monopoloy streets (Vine (st), Angel (islington), Bow (st), Bond (st))'},
  {number: 7, title: 'Planes', answer: 'WWII aircraft (Hurricane, Wellington, Mosquito, Lightning)'},
  {number: 8, title: 'Cars', answer: 'Classic car marques (Ford, Morris, Sunbeam, Jaguar)'},
  {number: 9, title: 'Shapes', answer: 'Regular shapes (Pentagon, (celebrity) Square(s), Triangle, Hexagon)'},
  {number: 10, title: 'Compass Points', answer: 'Points of the compass (South (park), (our friends in the) North, West(ie), East (is east))'},
  {number: 11, title: 'Friends', answer: 'Friends caharacters (Ross (castle), Chandler, Monica (Lewinksy), Joey)'},
  {number: 12, title: 'Monty Python', answer: 'Monty Pythin Sketches (Lumberjack (song), (dead) Parrot, Cheese Shop, Spanish Inquisition)'},
  {number: 13, title: 'Tom Jones', answer: 'Tom Jones songs ((whats new pussy(cat), Delilah, (the green, green) Grass, Kiss)'},
  {number: 14, title: 'Phonetic Alphabet', answer: 'Phonetic alphabet (Golf, Whisky, Zulu, X-ray)'},
  {number: 15, title: 'Hills', answer: 'Hills (Notting Hill, The Hills, Box Hill, Harry Hill)'},
  {number: 16, title: 'Dads Army', answer: 'Dad Army characters (Wilson, Walker, Pike, Sponge)'},
  {number: 17, title: 'Pedestrian Crossings', answer: 'Pedestrian Crossings (Panda, Pegasus, Puffin, Toucan)'},
  {number: 18, title: 'Babe', answer: 'Babe (Babe (band), Olive Hardy, Babe (ruth), Babe (film))'},
  {number: 19, title: 'US Presidents', answer: 'US Presidents (Lincoln, Munroe, Hoover, Madison, Bush, Garfield, Cleveland, Wilson, Ford)'},
  {number: 20, title: 'Berries', answer: 'Berries (Gooseberry, Hayberry, Tayberry, Raspberry, Billberry, Loganberry, Elderberry, Boysenberry)'},
  {number: 21, title: 'Bond Girls', answer: 'Bond Girls (Domino, Honey (Ryder), Solitaire, Pussy (Galore), Paris (Carver), Mayday, Vesper (Lynd), (Dr.) Christmas Jones)'}
]

const config = {
  noOfRounds: 0,
  rounds: [],
  slide: 1,
  round: 1
}

module.exports = {

  slides: function() {
    return slides  
  },

  initialConfig: function() {
      return config
  },

  addToRound: function(slide, round) {
    const newRound = []
    for (let i = 0; i < round.length; i++) {
      if (round[i].number != slide) {
        newRound.push(round[i])
      }
    }
    slide = slides.find(function(s) {
      return s.number == slide
    })
    newRound.push(slide)
    return newRound
  },

  deleteFromRound: function(slide, round) {
    const newRound = []
    for (let i = 0; i < round.length; i++) {
      if (round[i].number != slide) {
        newRound.push(round[i])
      }
    }
    return newRound
  }
}
