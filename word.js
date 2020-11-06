const board = [
  ["L", "X", "C", "X"],
  ["L", "X", "C", "S"],
  ["A", "B", "C", "E"],
  ["S", "F", "C", "S"],
  ["A", "D", "E", "E"],
];

//const word = "ABCCED";
const word = "ABXXL";

function isExist(word) {
  const words = word.split("");
  const startPositions = findPossibleStarts(words[0]);
  if (!startPositions.length) {
    return false;
  }

  const solutions = startPositions.map((start) =>
    findPath(start, words.slice(1))
  );
  const flattenSolutions = solutions.flat(Infinity).filter(Boolean);

  return !!flattenSolutions.length;
}

function findPath(currentLetter, wordsToMatch, usedWords = new Set()) {
  if (wordsToMatch.length === 0) {
    return true;
  }
  const nextLetter = wordsToMatch[0];
  usedWords.add(stringifyCoords(currentLetter));
  const possiblePaths = getMatchedNeighbors(currentLetter, nextLetter);
  const filteredPaths = possiblePaths.filter(
    (path) => !usedWords.has(stringifyCoords(path))
  );

  return filteredPaths.map((path) => {
    return findPath(path, wordsToMatch.slice(1), usedWords);
  });
}

function stringifyCoords({ colIndex, rowIndex }) {
  return `col:${colIndex}; row:${rowIndex};`;
}

function getMatchedNeighbors({ colIndex, rowIndex }, matchLetter) {
  return getAllNeighbors({ colIndex, rowIndex }).filter(
    (neighbors) => neighbors.letter === matchLetter
  );
}

function getAllNeighbors({ colIndex, rowIndex }) {
  const topNeighbor = getNeighborByIndex({
    rowIndex: rowIndex - 1,
    colIndex,
  });
  const bottomNeighbor = getNeighborByIndex({
    rowIndex: rowIndex + 1,
    colIndex,
  });
  const leftNeighbor = getNeighborByIndex({
    rowIndex,
    colIndex: colIndex - 1,
  });
  const rightNeighbor = getNeighborByIndex({
    rowIndex,
    colIndex: colIndex + 1,
  });

  return [topNeighbor, bottomNeighbor, leftNeighbor, rightNeighbor].filter(
    Boolean
  );
}

function getNeighborByIndex({ colIndex, rowIndex }) {
  const letter = board[rowIndex]?.[colIndex];

  return letter
    ? {
        letter,
        colIndex,
        rowIndex,
      }
    : null;
}

function findPossibleStarts(initialLetter) {
  const startsIndexes = [];
  board.forEach((row, rowIndex) => {
    row.forEach((letter, colIndex) => {
      if (letter === initialLetter) {
        startsIndexes.push({
          colIndex,
          rowIndex,
          letter,
        });
      }
    });
  });

  return startsIndexes;
}

console.log(isExist(word));
