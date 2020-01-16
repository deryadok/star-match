import React from 'react';
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
      key={props.number} className="number" 
      onClick={() => props.onClick(props.number,props.status)} 
      style={{backgroundColor: colors[props.status]}}>
      {props.number}
      </button>
  );
}

const StarMatch = () =>{
  const [stars, setStars] = React.useState(utils.random(1,9));
  const [avaliableNums, setAvaliableNums] = React.useState(utils.range(1,9));
  const [candidateNums, setCandidateNums] = React.useState([]);

  const candidatesAreWrong = utils.sum(candidateNums) > stars;
  
  const numberStatus = (number) => {
    if(!avaliableNums.includes(number)){
      return 'used';
    }
    if(candidateNums.includes(number)){
      return candidatesAreWrong ? 'wrong' : 'candidate';
    }
    return 'avaliable';
  };

  const onNumberClick = (number, currentStatus) => {
    
    if(currentStatus === 'used'){
      return;
    }
    
    const newCandidateNums = currentStatus === 'available' ? candidateNums.concat(number) : candidateNums.filter(cn => cn !== number);
    
    if(utils.sum(newCandidateNums) !== stars){
      setCandidateNums(newCandidateNums);
    }
    else{
      const newAvaliableNums = avaliableNums.filter(
        n => !newCandidateNums.includes(n)
      );
      setStars(utils.randomSumIn(newAvaliableNums,9));
      setAvaliableNums(newAvaliableNums);
      setCandidateNums([]);
    }

  };

  return(
    <div className="game">
      <div className="help">
        Yıldızların toplamını bir ya da birden fazla rakamı seçerek bul!
      </div>
      <div className="body">
        <div className="left">
          <StarsDisplay count={stars}></StarsDisplay>
        </div>
        <div className="right">
          {utils.range(1, 9).map(number =>
            <PlayNumber key={number} number={number} status={numberStatus(number)} onClick={onNumberClick}/>
          )}
        </div>
      </div>
      <div className="timer">
          Kalan süre: 10
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
