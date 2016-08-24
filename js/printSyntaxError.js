var log, path, printLocation, printOffender, repeatString;

repeatString = require("repeat-string");

path = require("path");

log = require("log");

module.exports = function(error, filePath) {
  var code, column, label, line;
  if (error.location) {
    line = error.location.first_line;
    column = error.location.first_column;
  }
  log.plusIndent(2);
  log.moat(1);
  label = log.color.red(error.constructor.name);
  log.withLabel(label, error.message);
  log.moat(1);
  printLocation(line - 1, filePath);
  log.moat(1);
  code = error.code.split(log.ln);
  printOffender(code[line], column);
  log.popIndent();
};

printLocation = function(lineNumber, filePath) {
  var dirName, dirPath;
  log.yellow("" + lineNumber);
  log(repeatString(" ", 5 - ("" + lineNumber).length));
  if (filePath != null) {
    dirName = path.dirname(filePath);
    dirPath = path.relative(lotus.path, dirName);
    if (dirName !== ".") {
      log.green.dim(dirPath + "/");
    }
    log.green(path.basename(filePath));
  }
};

printOffender = function(line, column) {
  var columnIndent, hasOverflow, rawLength;
  rawLength = line.length;
  line = line.replace(/^\s*/, "");
  columnIndent = repeatString(" ", column + line.length - rawLength);
  log.pushIndent(log.indent + 5);
  hasOverflow = (log.process != null) && log.process.stdout.isTTY && log.indent + line.length > log.process.stdout.columns;
  if (hasOverflow) {
    line = line.slice(0, log.process.stdout.columns - log.indent - 4);
  }
  log.moat(0);
  log(line);
  if (hasOverflow) {
    log.gray.dim("...");
  }
  log(log.ln, columnIndent);
  log.red("▲");
  log.moat(0);
  log.popIndent();
};

//# sourceMappingURL=map/printSyntaxError.map
