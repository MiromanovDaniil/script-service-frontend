// Character
export const character = {
  id: '', // string
  name: '', // string
}

// Script
export const script = {
  id: '', // string
  name: '', // string
  answersCount: 0, // number (или BigInt, если хочешь)
  branchesCount: 0, // number (или BigInt)
  character: character, // объект Character
  description: '', // string
  getsItem: false, // boolean
  itemName: '', // string
  itemCondition: '', // string
  getsInfo: false, // boolean
  infoName: '', // string
  infoCondition: '', // string
  additional: '', // string
}

// Scene
export const scene = {
  id: '', // string
  name: '', // string
  scripts: [script], // массив Script
  characters: [character], // массив Character
}

// Game
export const game = {
  id: '', // string
  name: '', // string
  scenes: [scene], // массив Scene
  characters: [character], // массив Character
}
