function getStatusSquare(status: string) {
  switch (status) {
    case 'CORRECT':
      return '🟩';
    case 'ALBUM':
      return '🟧';
    case 'WRONG':
      return '🟥';
    default:
      return '⬜';
  }
}

const statusSquares = (guessStatuses: string[]): string => {
  let squares: string[] = [];

  guessStatuses?.forEach((status) => {
    squares.push(getStatusSquare(status));
  });

  return squares.join('');
};

export default statusSquares;
