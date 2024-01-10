import React, { useEffect } from 'react'
import { easy, easy_hebrew, hard, hard_hebrew } from '../../difficulty/WordDifficulty';
import styles from '../../styles/pages/memoryGame.module.css'
import './singleCard.css'


export default function SingleCard({ card, handleChoice, flipped }) {

    const handleClick = () => {
      handleChoice(card)
    }
    
    return (
      <div className='card'>
              <div className={flipped ? "flipped" : ""}>
                {/* <img src="imgs/frontCard.png" alt="" /> */}
                <div className='div'>
                <p className='front'>{card.src}</p>
                </div>
              <img className='back' 
              src='imgs/cover.png' 
              onClick={handleClick} 
              alt='card back'
              />
            </div>
          </div>
  )}