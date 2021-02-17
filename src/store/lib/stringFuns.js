
module.exports = {

  initials: function(punter) {
    const s = punter.toString().split(' ')
    let str = ''
    for (let i = 0; i < s.length; i++) {
      str = str + s[i][0].toUpperCase()
    }
    return str
  }
}
