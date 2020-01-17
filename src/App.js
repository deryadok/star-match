import React, { useEffect } from 'react';
import './App.css';

function App() {
  return (
    <StarMatch></StarMatch>      
  );
}

const StarsDisplay = (props) => {
  return(
    <>
      {utils.range(1, props.count).map(starId => 
        <div key= {starId} className="star"></div>
      )}
    </>
  );
}

const PlayNumber = (props) => {
  return(
    <button 
      className="number" 
      onClick={() => props.onClick(props.number, props.status)} 
      style={{backgroundColor: colors[props.status]}}>
      {props.number}
      </button>
  );
}

const PlayAgain = (props) => {
  return(
    <div className="game-done">
    <div className="message" style = {{color: props.gameStatus === 'lost' ? 'red' : 'green'}}>{props.gameStatus === 'lost' ? 'Game Over' : 'You Won'}</div>
      <button onClick={props.onClick}>Tekrar Oyna!</button>
    </div>
  );
}

const useGameState = () => {
  
  const [stars, setStars] = React.useState(utils.random(1,9));
  const [avaliableNums, setAvaliableNums] = React.useState(utils.range(1,9));
  const [candidateNums, setCandidateNums] = React.useState([]);
  const [secondsLeft, setSecondsLeft] = React.useState(10);

  useEffect(() =>{
    if(secondsLeft > 0 && avaliableNums.length > 0){
      const timerId = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  });

  const setGameState = (newCandidateNums) => {

    if (utils.sum(newCandidateNums) !== stars) {
      setCandidateNums(newCandidateNums);
    } else {
      const newAvaliableNums = avaliableNums.filter(
        n => !newCandidateNums.includes(n)
      );

      setStars(utils.randomSumIn(newAvaliableNums, 9));
      setAvaliableNums(newAvaliableNums);
      setCandidateNums([]);
    }
  }

  return {stars, avaliableNums, candidateNums, secondsLeft, setGameState}
}


const Game = (props) =>{
  
  const {
    stars,
    avaliableNums,
    candidateNums,
    secondsLeft,
    setGameState,
  } = useGameState()

  const candidatesAreWrong = utils.sum(candidateNums) > stars;
  const gameStatus = avaliableNums.length === 0 ? 'won' : secondsLeft === 0 ? 'lost' : 'active'
  
  const numberStatus = (number) => {
    if(!avaliableNums.includes(number)){
      return 'used';
    }
    if(candidateNums.includes(number)){
      return candidatesAreWrong ? 'wrong' : 'candidate';
    }
    return 'available';
  };

  const onNumberClick = (number, currentStatus) => {
    
    if(gameStatus !== 'active' || currentStatus === 'used'){
      return;
    }
    
    const newCandidateNums = currentStatus === 'available' ? candidateNums.concat(number) : candidateNums.filter(cn => cn !== number);
    
    setGameState(newCandidateNums);
  };

  return(
    <div className="game">
      <div className="help">
        Yıldızların toplamını bir ya da birden fazla rakamı seçerek bul!
      </div>
      <div className="body">
        <div className="left">
          {gameStatus !== 'active' ? (<PlayAgain onClick={props.startNewGame} gameStatus={gameStatus}></PlayAgain>) : (<StarsDisplay count={stars}></StarsDisplay>)}
        </div>
        <div className="right">
          {utils.range(1, 9).map(number =>
            <PlayNumber key={number} number={number} status={numberStatus(number)} onClick={onNumberClick}/>
          )}
        </div>
      </div>
      <div className="timer">
          Kalan süre: {secondsLeft}
      </div>
    </div>
  );
}

const colors = {
  avaliable : 'lightgray',
  used : 'lightgreen',
  wrong : 'lightcoral',
  candidate : 'deepskyblue'
};

const StarMatch = () => {
  const [gameId, setGameId] = React.useState(1);
  return <Game key={gameId} startNewGame={() => setGameId(gameId + 1)}/>
}

const utils = {
  sum : arr => arr.reduce((acc,curr) => acc + curr, 0),
  range : (min, max) => Array.from({length: max - min +1}, (_,i) => min + i),
  random : (min, max) => min + Math.floor(Math.random() * (max - min + 1)),
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for(let i = 0; i<arr.length; i++){
      var len = sets.length; 
      for(let j = 0; j < len; j++){
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if(candidateSum <= max){
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
      return sums[utils.random(0, sums.length -1)];
    }
  }, 
};

export default App;
