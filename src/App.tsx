// APP.TSX
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import './styles/styles.css';
import Deck from './components/Deck';
import CardGallery from './components/CardGallery';
import About from './components/About';
import { Player, players } from './data/players';

// STATE DECLARATIONS
const App: React.FC = () => {
  const [round, setRound] = useState<number>(1);
  const [cpuScore, setCpuScore] = useState<number>(0);
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [cards, setDealCards] = useState<string[]>([]);
  const [shuffledPlayerDeck, setShuffledPlayerDeck] = useState<Player[]>([]);
  const [shuffledCpuDeck, setShuffledCpuDeck] = useState<Player[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [flippedPlayerIndex, setFlippedPlayerIndex] = useState<number | null>(
    null
  );
  const [flippedCpuIndex, setFlippedCpuIndex] = useState<number | null>(null);
  const [roundWinner, setRoundWinner] = useState<string>('');
  const [showWinnerNotification, setshowWinnerNotification] =
    useState<boolean>(false);
  const [winnerText, setWinnerText] = useState<string>('');
  const [resetCards, setResetCards] = useState<boolean>(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [soundEffects] = useState({
    dealCard: new Audio('/audio/dealcard.mp3'),
    gamelose: new Audio('/audio/gamelose.mp3'),
    gamewin: new Audio('/audio/gamewin.mp3'),
    roundeven: new Audio('/audio/roundeven.mp3'),
    roundlose: new Audio('/audio/roundlose.mp3'),
    roundwin: new Audio('/audio/roundwin.mp3'),
    shuffle: new Audio('/audio/shuffle.mp3'),
  });

  // SHUFFLE DECK AND DEAL CARDS WHENEVER ROUND CHANGES
  const shuffleDeck = useCallback(() => {
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    return shuffled;
  }, []);

  const dealCards = useCallback(() => {
    const cards = ['0', '1', '2'].sort(() => Math.random() - 0.5);
    setDealCards(cards);
  }, []);

  useEffect(() => {
    setShuffledPlayerDeck(shuffleDeck());
    setShuffledCpuDeck(shuffleDeck());
    dealCards();
  }, [dealCards, shuffleDeck, round]);

  // GAME LOGIC
  const handleClick = useCallback(
    (selection: number) => {
      if (!isClicked && !resetCards && isPlayerTurn) {
        setIsPlayerTurn(false);
        setFlippedPlayerIndex(selection);
        soundEffects.dealCard.currentTime = 0;
        soundEffects.dealCard.play();

        const cpuRevealTimeout = setTimeout(() => {
          const randomCpuIndex = Math.floor(Math.random() * cards.length);
          setFlippedCpuIndex(randomCpuIndex);
          soundEffects.dealCard.currentTime = 0;
          soundEffects.dealCard.play();

          const winnerTimeout = setTimeout(() => {
            const cpuCard = shuffledCpuDeck[randomCpuIndex];
            const playerCard = shuffledPlayerDeck[selection];

            if (playerCard.name === cpuCard.name) {
              setRoundWinner('Draw');
              setWinnerText(
                `It's a draw between ${playerCard.name} and ${cpuCard.name}`
              );
              soundEffects.roundeven.currentTime = 0;
              soundEffects.roundeven.play();
            } else if (playerCard.rank < cpuCard.rank) {
              setRoundWinner('Player');
              setWinnerText(`${playerCard.name} defeats ${cpuCard.name}`);
              setPlayerScore((prevScore) => prevScore + 1);
              soundEffects.roundwin.currentTime = 0;
              soundEffects.roundwin.play();
            } else {
              setRoundWinner('CPU');
              setWinnerText(`${cpuCard.name} defeats ${playerCard.name}`);
              setCpuScore((prevScore) => prevScore + 1);
              soundEffects.roundlose.currentTime = 0;
              soundEffects.roundlose.play();
            }

            const resetTimeout = setTimeout(() => {
              setRoundWinner('');
              setIsClicked(false);
              setFlippedPlayerIndex(null);
              setFlippedCpuIndex(null);
              setResetCards(false);
              setIsPlayerTurn(true);
            }, 3000);

            return () => clearTimeout(resetTimeout);
          }, 2000);

          return () => clearTimeout(winnerTimeout);
        }, 2000);

        return () => clearTimeout(cpuRevealTimeout);
      }
    },
    [
      cards.length,
      isClicked,
      isPlayerTurn,
      resetCards,
      shuffledCpuDeck,
      shuffledPlayerDeck,
      soundEffects,
    ]
  );

  // WINNER NOTIFICATION AND SCORE INCREMENTATION
  useEffect(() => {
    if (roundWinner) {
      setshowWinnerNotification(true);
      const notificationTimeout = setTimeout(() => {
        setshowWinnerNotification(false);
        setRound((prevRound) => prevRound + 1);
        setRoundWinner('');
        setIsClicked(false);
        setFlippedPlayerIndex(null);
        setFlippedCpuIndex(null);
        setResetCards(false);
        soundEffects.shuffle.play();
      }, 2000);

      return () => clearTimeout(notificationTimeout);
    }
  }, [roundWinner, soundEffects]);

  // CHECK FOR GAME WINNER
  useEffect(() => {
    if (playerScore >= 50 || cpuScore >= 50) {
      if (playerScore >= 50) {
        setWinnerText('You win the game!');
        soundEffects.gamewin.currentTime = 0;
        soundEffects.gamewin.play();
      } else {
        setWinnerText('CPU wins the game!');
        soundEffects.gamelose.currentTime = 0;
        soundEffects.gamelose.play();
      }
      setshowWinnerNotification(true);

      // RESET SCORES AND ROUND COUNT AFTER GAME IS FINISHED
      setTimeout(() => {
        setPlayerScore(0);
        setCpuScore(0);
        setRound(1);
        setWinnerText('');
        setshowWinnerNotification(false);
      }, 2000);
    }
  }, [cpuScore, playerScore, soundEffects]);

  // CARD GALLERY WINDOW
  const openGallery = useCallback(() => {
    setIsGalleryOpen(true);
  }, []);

  const closeGallery = useCallback(() => {
    setIsGalleryOpen(false);
  }, []);

  // ABOUT WINDOW
  const openAbout = useCallback(() => {
    setIsAboutOpen(true);
  }, []);

  const closeAbout = useCallback(() => {
    setIsAboutOpen(false);
  }, []);

  // RENDER THE COMPONENT
  return (
    <div className={`app-container ${isClicked ? 'clicked' : ''}`}>
      <Notification show={showWinnerNotification}>
        {winnerText && <h3>{winnerText}</h3>}
      </Notification>
      <p className='cpu-score'>CPU Score: {cpuScore}</p>
      <p className='player-score'>Your Score: {playerScore}</p>
      <p className='round'>Round: {round}</p>
      <div className='app'>
        <h1>Hockey All Stars</h1>
        <img src='/images/icon.png' alt='Icon' className='icon' />
        <div className='cpu-card-container'>
          {cards.map((_, index) => (
            <Deck
              cardType='cpu'
              key={`cpu-${index}`}
              reset={resetCards}
              shuffledPlayers={shuffledCpuDeck}
              revealCard={flippedCpuIndex === index}
              index={index}
            />
          ))}
        </div>
        <div className='player-card-container'>
          {cards.map((_, index) => (
            <Deck
              cardType='player'
              key={`player-${index}`}
              reset={resetCards}
              shuffledPlayers={shuffledPlayerDeck}
              revealCard={flippedPlayerIndex === index}
              index={index}
              onClick={handleClick}
              disabled={!isPlayerTurn}
            />
          ))}
        </div>
        <CardGalleryButton className='styled-button' onClick={openGallery}>
          Card Gallery
        </CardGalleryButton>
        <AboutButton className='styled-button' onClick={openAbout}>
          About
        </AboutButton>
      </div>
      {isGalleryOpen && (
        <div className='modal-overlay' onClick={closeGallery}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <button className='modal-close' onClick={closeGallery}>
              &times;
            </button>
            <CardGallery onClose={closeGallery} />
          </div>
        </div>
      )}
      {isAboutOpen && (
        <div className='modal-overlay' onClick={closeAbout}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <button className='modal-close' onClick={closeAbout}>
              &times;
            </button>
            <About onClose={closeAbout} />
          </div>
        </div>
      )}
    </div>
  );
};

// STYLED COMPONENTS
const CardGalleryButton = styled.button`
  background-color: #000000;
  color: #ffffff;
  padding: 10px 20px;
  font-size: 16px;
  border: 2px solid #ffffff;
  border-radius: 10px;
  cursor: pointer;
  position: fixed;
  bottom: 70px;
  right: 20px;
  &:hover {
    background-color: #000000;
    opacity: 0.7;
  }
`;

const AboutButton = styled.button`
  background-color: #000000;
  color: #ffffff;
  padding: 10px 44px;
  font-size: 16px;
  border: 2px solid #ffffff;
  border-radius: 10px;
  cursor: pointer;
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: auto;
  text-align: center;
  &:hover {
    background-color: #000000;
    opacity: 0.7;
  }
`;

const Notification = styled.div<{ show: boolean }>`
  position: fixed;
  top: 50%;
  left: 49.5%;
  transform: translate(-50%, -50%);
  padding: 30px;
  border-radius: 10px;
  background-color: #000000;
  color: #ffffff;
  display: ${(props) => (props.show ? 'block' : 'none')};
  text-align: center;
  z-index: 999;
`;

export default App;
