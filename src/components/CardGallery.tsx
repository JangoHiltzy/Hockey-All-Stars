// CARDGALLERY.TSX
import React, { useEffect, useRef } from "react";
import { players } from "../data/players";
import "../styles/styles.css";

interface CardGalleryProps {
  onClose: () => void;
}

const CardGallery: React.FC<CardGalleryProps> = ({ onClose }) => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const scrollDirectionRef = useRef<number>(0);
  const scrollTimeoutRef = useRef<number | null>(null);
  const scrollIntervalRef = useRef<number | null>(null);

  // EFFECT HOOK TO HANDLE KEY EVENTS AND SCROLL BEHAVIOR
  useEffect(() => {
    // EVENT HANDLER FOR KEY DOWN EVENTS (LEFT AND RIGHT ARROW KEYS)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const gallery = galleryRef.current;
        if (!gallery) return;

        const scrollAmount = gallery.clientWidth;
        scrollDirectionRef.current =
          event.key === "ArrowLeft" ? -scrollAmount : scrollAmount;

        startScroll();
      }
    };

    // EVENT HANDLER FOR KEY UP EVENTS (LEFT AND RIGHT ARROW KEYS)
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        stopScroll();
      }
    };

    // INITIATES SCROLLING BASED ON SCROLL DIRECTION
    const startScroll = () => {
      if (!scrollTimeoutRef.current) {
        scrollGallery();
        scrollTimeoutRef.current = window.setTimeout(() => {
          scrollInterval();
        }, 100);
      }
    };

    // SCROLLS THE GALLERY BASED ON CURRENT SCROLL DIRECTION
    const scrollGallery = () => {
      const gallery = galleryRef.current;
      if (!gallery) return;

      gallery.scrollTo({
        left: gallery.scrollLeft + scrollDirectionRef.current,
        behavior: "smooth",
      });
    };

    // SETS UP INTERVAL FOR CONTINUOUS SCROLLING
    const scrollInterval = () => {
      scrollIntervalRef.current = window.setInterval(() => {
        scrollGallery();
      }, 400);
    };

    // STOPS BOTH TIMEOUT AND INTERVAL FOR SCROLLING
    const stopScroll = () => {
      if (scrollTimeoutRef.current !== null) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
      if (scrollIntervalRef.current !== null) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    };

    // PRELOADS IMAGES TO IMPROVE PERFORMANCE
    const preloadImages = () => {
      players.forEach((player) => {
        const img = new Image();
        img.src = getCardImagePath(player.name);
      });
    };
    preloadImages();

    // ADDS EVENT LISTENERS FOR KEY EVENTS WHEN COMPONENT MOUNTS
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    // REMOVE EVENT LISTENERS AND STOP SCROLLING
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      stopScroll();
    };
  }, []);

  // FUNCTION TO GET THE PATH OF THE CARD IMAGE BASED ON PLAYER NAME
  const getCardImagePath = (playerName: string) => {
    return `/images/card-gallery/${playerName
      .toLowerCase()
      .replace(/\s/g, "")}gallery.jpg`;
  };

  // HANDLING CLICK ON MODAL TO CLOSE
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // RENDER THE MODAL
  return (
    <div className='modal-overlay'>
      <div className='modal-content' onClick={handleModalClick}>
        <button className='modal-close' onClick={onClose}>
          &times;
        </button>
        <h2 className='gallery-header'>Card Gallery</h2>
        <div className='card-gallery' ref={galleryRef}>
          {players.map((player, index) => (
            <div key={index} className='card-item'>
              <img
                src={getCardImagePath(player.name)}
                alt={player.name}
                className='card-image'
              />
            </div>
          ))}
        </div>
        <div className='gallery-navigation'>
          <p>
            Press <strong>←</strong>&nbsp;<strong>→</strong> or swipe to scroll
            through player cards!
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardGallery;
