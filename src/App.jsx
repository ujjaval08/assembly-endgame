import React, { useState } from "react";
import { languages } from "./languages.js";
import clsx from "clsx";
import { getFarewellText, getRandomWord } from "./utils.js";

const App = () => {
  //state values
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());
  const [gussedLetters, setGussedLetters] = useState([]);

  //dervied values
  const wrongGussesCount = gussedLetters.filter(
    (letter) => !currentWord.includes(letter)
  ).length;
  const isGameWon = currentWord
    .split("")
    .every((letter) => gussedLetters.includes(letter));
  const isGameLost = wrongGussesCount >= languages.length - 1;
  const isGameOver = isGameWon || isGameLost;
  const lastGussedLetter = gussedLetters[gussedLetters.length - 1];
  const isLastGuessIncorrect = lastGussedLetter && !currentWord.includes(lastGussedLetter);


  //static values
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  function addGussedLetter(letter) {
    setGussedLetters((prevLetters) =>
      prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
    );
  }

  function startNewGame() {
    setCurrentWord(getRandomWord())
    setGussedLetters([])
  }
  
  const languageElements = languages.map((lang, index) => {
    const isLanguageLost = index < wrongGussesCount;
    const className = clsx("chip", { lost: isLanguageLost });
    return (
      <span
        key={lang.name}
        className={className}
        style={{ backgroundColor: lang.backgroundColor, color: lang.color }}
      >
        {lang.name}
      </span>
    );
  });

  const letterElements = currentWord
    .split("")
    .map((letter, index) => 
    {
      const letterClassName = clsx(
        isGameLost && !gussedLetters.includes(letter) && "missed-letter"
      )
      return <span className={letterClassName} key={index}>
        {isGameLost || gussedLetters.includes(letter) ? letter.toUpperCase() : ""}
      </span>
});

  const keyboardElements = alphabet.split("").map((letter) => {
    const isGussed = gussedLetters.includes(letter);
    const isCorrect = isGussed && currentWord.includes(letter);
    const isWrong = isGussed && !currentWord.includes(letter);

    const className = clsx({
      correct: isCorrect,
      wrong: isWrong,
    });
    return (
      <button
        className={className}
        key={letter}
        disabled={isGameOver}
        aria-disabled={gussedLetters.includes(letter)}
        aria-label={`letter ${letter}`}
        onClick={() => addGussedLetter(letter)}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  const gameStatusClass = clsx('game-status', {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect
  })

  function renderGameStatus() {
    if(!isGameOver && isLastGuessIncorrect) {
      return <p className="farwell-message">
        {getFarewellText(languages[wrongGussesCount - 1].name)}
      </p>;
    }

    if(isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well Done!</p>
        </>
      )
    }

    if(isGameLost) {
      return (
        <>
          <h2>Game Over!</h2>
          <p>You lose! Better start learning Assembly</p>
        </>
      )
    }
  }

  return (
    <main>
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word within 8 attempts to keep the programing world safe
          from assembly!
        </p>
      </header>
      <section 
        aria-live="polite" 
        role="status" 
        className={gameStatusClass}
      >
        {renderGameStatus()}
      </section>

      <section className="language-chips">
        {languageElements}
      </section>

      <section className="word">
        {letterElements}
      </section>


      <section className="keyboard">
        {keyboardElements}</section>
      {isGameOver && <button onClick={startNewGame} className="new-game">New Game</button>}
    </main>
  );
};

export default App;
