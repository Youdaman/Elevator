let _ = require('lodash');

let A = {
  name: 'A',
  from: 10,
  to: 0,
  when: 0,
  button: 'down',
  done: false,
}

let B = {
  name: 'B',
  from: 4,
  to: 8,
  when: 3,
  button: 'up',
  done: false,
}

let C = {
  name: 'C',
  from: 2,
  to: 0,
  when: 3,
  button: 'up',
  done: false,
}

let D = {
  name: 'D',
  from: 15,
  to: 11,
  when: 8,
  button: 'down',
  done: false,
}

let requests = [A, B, C, D]

let floor = 0
let direction = 'up'
let queue = []
let count = 0
passengers = []

function operate() {
  console.log('floor:', floor)
  console.log('direction:', direction)

  // remove current floor from queue
  queue = _.without(queue, floor)

  // get direction based on current floor and next floor (next floor is the first floor in the queue)
  // direction = queue[0] > floor ? 'up' : 'down'
  direction = queue[0] > floor ? 'up' : queue[0] < floor ? 'down' : direction // if queue[0] === floor, keep direction

  // get leavers
  let leavers = _.filter(passengers, { to: floor })
  leavers.forEach(l => {
    console.log(`${l.name} is out`)
  })

  // remove leavers from passengers and requests
  passengers = _.without(passengers, ...leavers)
  requests = _.without(requests, ...leavers)

  // get pressers and boarders
  let pressers = _.filter(requests, { when: floor })
  pressers.forEach(p => {
    console.log(`${p.name} is pressing ${p.button} at ${p.from}`)
  })

  // only pick up boarders if they are going in the same direction

  // let boarders = _.filter(requests, r => r.from === floor && ((r.when < floor && direction === 'up') || (r.when > floor && direction === 'down')))
  let boarders = _.filter(requests, { from: floor, button: direction })
  // let boarders = _.filter(requests, r => r.from === floor && r.direction === direction)
  boarders.forEach(b => {
    console.log(`${b.name} is in and going to ${b.to}`)
  })

  passengers = _.concat(passengers, boarders)
  console.log('passengers:', _.map(passengers, 'name'))

  pressersFloors = _.map(pressers, 'from')
  boardersFloors = _.map(boarders, 'to')
  floors = _.concat(pressersFloors, boardersFloors)

  _.forEach(floors, f => {
    // set queue if empty based on direction
    if (_.isEmpty(queue)) {
      if (direction === 'up') {
        queue = floors.sort((a, b) => a - b);
      } else {
        queue = floors.sort((a, b) => b - a);
      }
    }
    // if queue not empty, add floor to queue based on direction
    else {

      // if direction up, add to front if floor > current floor, otherwise add to back
      if (direction === 'up') {
        if (f > floor) {
          queue.unshift(f)
        } else {
          queue.push(f)
        }
      }

      // if direction down, add to front if floor < current floor, otherwise add to back
      if (direction === 'down') {
        if (f < floor) {
          queue.unshift(f)
        } else {
          queue.push(f)
        }
      }

    }
  })

  queue = _.uniq(queue)
  console.log('queue:', queue)

  // move
  if (direction === 'up') {
    floor++
  } else {
    floor--
  }

  // keep operating unless queue empty
  if (!_.isEmpty(queue)) {
    operate()
  }
}

operate()
