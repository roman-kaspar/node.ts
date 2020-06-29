import { randInt } from './rand'
import { sum } from './sum'
import { version } from './version'

const a = randInt(100)
const b = randInt(200)

const c = sum(a, b)

console.log(`${a} + ${b} = ${c}`)
console.log(`(version ${version})`)
