// ABOUT.TSX
import React from "react";
import "../styles/styles.css";

interface AboutProps {
  onClose: () => void;
}

const About: React.FC<AboutProps> = ({ onClose }) => {
  // HANDLING CLICK ON MODAL TO CLOSE
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // RENDER THE MODAL
  return (
    <div className='modal-overlay'>
      &nbsp;
      <div className='modal-content about-modal' onClick={handleModalClick}>
        &nbsp;
        <button className='modal-close' onClick={onClose}>
          &times;
        </button>
        &nbsp;
        <div className='about-content'>
          &nbsp;
          <h2 className='about-header'>About Hockey All Stars</h2>
          &nbsp;
          <div className='modal-body'>
            &nbsp;
            <p>
              <strong>Hockey All Stars</strong>&nbsp;is a TypeScript and React
              project created by me, with the visual appearance managed using
              both Styled-components and CSS. It offers a card game experience
              featuring 100 NHL players, including 50 legendary players and 50
              current superstars, all personally selected and ranked based on my
              own opinion!
            </p>
            &nbsp;
            <p>
              In this game, you face off against the CPU, competing to see who
              has the highest-ranking card in each round.&nbsp;The goal is to
              win 50 rounds to claim victory!
            </p>
            &nbsp;
            <h3>Key Features</h3>
            &nbsp;
            <ul>
              <li>
                <strong>Player Selection:</strong>&nbsp;A unique blend of 50 NHL
                legends and 50 modern-day superstars.
              </li>
              &nbsp;
              <li>
                <strong>Custom Rankings:</strong>&nbsp;Players are ranked based
                on my personal evaluation, adding a distinctive touch to the
                game.
              </li>
              &nbsp;
              <li>
                <strong>Simple and Fun:</strong>&nbsp;Easy to understand and
                play, making it enjoyable for hockey fans of all ages.
              </li>
              &nbsp;
              <li>
                <strong>Card Gallery:</strong>&nbsp;Explore a comprehensive card
                gallery featuring all 100 player cards for your viewing
                pleasure!
              </li>
            </ul>
            &nbsp;
            <p>© 2024 Jani Hiltunen.</p>
            &nbsp;
            <h3>Additional Information</h3>
            &nbsp;
            <ul>
              <li>
                The images used in this software were sourced from Google.
              </li>
              &nbsp;
              <li>
                The card art for all players was created by me using:{" "}
                <a href='https://www.canva.com/'>Canva</a>.
              </li>
              &nbsp;
              <li>
                The sound effects used in this software were obtained from:{" "}
                <a href='https://pixabay.com/sound-effects/'>Pixabay</a>{" "}
                (non-copyright).
              </li>
              &nbsp;
            </ul>
            &nbsp;
          </div>
          &nbsp;
        </div>
        &nbsp;
      </div>
      &nbsp;
    </div>
  );
};

export default About;
