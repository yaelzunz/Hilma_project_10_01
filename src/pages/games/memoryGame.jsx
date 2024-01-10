import React, { useEffect, useState } from 'react'
import { easy, easy_hebrew, hard, hard_hebrew } from '../../difficulty/WordDifficulty';
import styles from '../../styles/pages/memoryGame.module.css'
import SingleCard from './singleCard';
import './memoryGame.css'




const generate = () => {
  let cardEasyEnglish = []
  let cardEasyHebrow = []
  const size = easy_hebrew.length;
  let index = [];
  while (index.length != 6) {
    let randomIndex = Math.floor(Math.random() * size)

    if(!index.includes(randomIndex)){
      index.push(randomIndex)
      cardEasyEnglish.push({"src": easy[randomIndex], matched: false, "inx": randomIndex})
      cardEasyHebrow.push({"src": easy_hebrew[randomIndex], matched: false, "inx": randomIndex})
    }   
    
  }

  return [cardEasyEnglish, cardEasyHebrow]
}

export default function MemoryGame() {

  const [cards, setCards] = useState([])
  const [turns, setTurns] = useState(0)
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)

  let wordsArraay = generate()

  const shuffleCards = () => {
    const shuffledCards = [...wordsArraay[0], ...wordsArraay[1]]
    .sort(() => Math.random() - 0.5)
    .map((card) => ({...card, id: Math.random() }))

    setCards(shuffledCards)
    setTurns(0)

  }

  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  }


  const finish = () => {
    let counter = 0;
    cards.forEach((e)=>{
      if(e.matched === true){
        console.log(e.matched)
        counter += 1
    }
    if(counter === cards.length){
      alert("finish")
    }
  })
   
  }


  useEffect(() => {
    if(choiceOne && choiceTwo){

      if(choiceOne.inx === choiceTwo.inx){
        setCards(prevCards => {
          return prevCards.map(card => {
            if(card.inx === choiceOne.inx){
              return {...card, matched: true}
            }
            else{
              return card
            }
          })
        })
        resetTurn()
      }
      else{
       setTimeout(() => resetTurn(), 1000) 
      }
    }

    finish()

  }, [choiceOne, choiceTwo])

 

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(prevTurns => prevTurns + 1)
  }

  
  return (
    <div className="app">
      <h1>Magic Match</h1>
      <button onClick={shuffleCards}>New Game</button>

      <div className='card-grid'>
        {cards.map(card => (
          <SingleCard 
            key={card.id} 
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}

          />
        ))}
      </div>
    </div>
  );   
}