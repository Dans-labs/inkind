export default function memoBind(thisArg, funcName, keyArgs, extraArgs) {
  if (typeof thisArg !== 'object' || !thisArg) {
    throw new TypeError('Invalid thisArg parameter.')
  }

  const { [funcName]: func } = thisArg
  if (typeof func !== 'function') {
    throw new TypeError(`'${funcName}' is not a function.`)
  }

  if (thisArg._memCache == null) {thisArg._memCache = {}}
  if (thisArg._memCache[funcName] == null) {
    thisArg._memCache[funcName] = {}
  }
  const cache = thisArg._memCache[funcName]

  const memoKey = JSON.stringify(keyArgs)
  if (cache[memoKey] == null) {
    cache[memoKey] = func.apply(thisArg, [...keyArgs, ...(extraArgs || [])])
  }
  return cache[memoKey]
}
