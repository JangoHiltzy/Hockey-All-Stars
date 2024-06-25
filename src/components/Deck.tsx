// DECK.TSX
import React, { useState, useEffect } from 'react';
import { Player } from '../data/players';

type CardType = 'player' | 'cpu';

interface DeckProps {
  cardType?: CardType;
  disabled?: boolean;
  index?: number;
  onClick?: (index: number) => void;
  reset: boolean;
  revealCard: boolean;
  shuffledPlayers: Player[];
}

const Deck: React.FC<DeckProps> = ({
  cardType,
  disabled,
  index,
  onClick,
  revealCard,
  shuffledPlayers,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // HANDLE CARD REVEALING
  useEffect(() => {
    setIsFlipped(revealCard);
  }, [revealCard]);

  // PRELOAD CARD IMAGES
  useEffect(() => {
    const preloadImages = () => {
      const imagePromises = shuffledPlayers.map((player) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = getCardArt(player);
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
        });
      });

      Promise.all(imagePromises).then((results) => {
        const allLoaded = results.every((result) => result);
        setIsImageLoaded(allLoaded);
      });
    };

    preloadImages();
  }, [shuffledPlayers]);

  // HANDLE CLICK EVENT ON CARD
  const handleClick = () => {
    if (onClick && index !== undefined && !disabled) {
      onClick(index);
      setIsFlipped(true);
    }
  };

  // GET CARD IMAGE URL
  const getCardArt = (card?: Player) => {
    return card?.image || '';
  };

  // GET ALT TEXT FOR CARD IMAGE
  const getAltText = (card?: Player) => {
    return card ? `${card.name} card` : '';
  };

  // RENDER COMPONENT
  return (
    <div className={`card ${isFlipped ? 'flipped' : ''}`} onClick={handleClick}>
      {cardType === 'cpu' && (
        <div className='front'>
          {isFlipped &&
            index !== undefined &&
            shuffledPlayers[index] &&
            isImageLoaded && (
              <img
                src={getCardArt(shuffledPlayers[index])}
                alt={getAltText(shuffledPlayers[index])}
                style={{ borderRadius: '8px' }}
              />
            )}
        </div>
      )}

      {cardType === 'player' && (
        <div className='front'>
          {isFlipped &&
            index !== undefined &&
            shuffledPlayers[index] &&
            isImageLoaded && (
              <img
                src={getCardArt(shuffledPlayers[index])}
                alt={getAltText(shuffledPlayers[index])}
                style={{ borderRadius: '8px' }}
              />
            )}
        </div>
      )}

      <div className='back'>
        {!isFlipped && cardType === 'cpu' && (
          <img
            src={`/images/cpucardback.jpg`}
            alt={'CPU Card Back'}
            style={{ borderRadius: '8px' }}
          />
        )}
        {!isFlipped && cardType === 'player' && (
          <img
            src={`/images/playercardback.jpg`}
            alt={'Player Card Back'}
            style={{ borderRadius: '8px' }}
          />
        )}
      </div>
    </div>
  );
};

export default Deck;
