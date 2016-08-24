
repeatString = require "repeat-string"
path = require "path"
log = require "log"

module.exports = (error, filePath) ->

  if error.location
    line = error.location.first_line
    column = error.location.first_column

  log.plusIndent 2
  log.moat 1

  label = log.color.red error.constructor.name
  log.withLabel label, error.message

  log.moat 1
  printLocation line - 1, filePath
  log.moat 1

  code = error.code.split log.ln
  printOffender code[line], column

  log.popIndent()
  return

printLocation = (lineNumber, filePath) ->

  log.yellow "#{lineNumber}"
  log repeatString " ", 5 - "#{lineNumber}".length

  if filePath?
    dirName = path.dirname filePath
    dirPath = path.relative lotus.path, dirName
    log.green.dim dirPath + "/" if dirName isnt "."
    log.green path.basename filePath
  return

printOffender = (line, column) ->
  rawLength = line.length

  # Remove spaces from the beginning of the offending line of code.
  line = line.replace /^\s*/, ""

  # Calculate the position of the ▲ icon.
  columnIndent = repeatString " ", column + line.length - rawLength

  log.pushIndent log.indent + 5

  hasOverflow =
    log.process? and
    log.process.stdout.isTTY and
    log.indent + line.length > log.process.stdout.columns

  if hasOverflow
    line = line.slice 0, log.process.stdout.columns - log.indent - 4

  log.moat 0
  log line
  log.gray.dim "..." if hasOverflow
  log log.ln, columnIndent
  log.red "▲"
  log.moat 0
  log.popIndent()
  return
