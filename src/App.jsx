import styled from 'styled-components'
import './normalize.css'
import { useEffect, useState } from 'react'

const BIRD_SIZE = 20
const GAME_WIDTH = 500
const GAME_HEIGHT = 500
const GRAVITY = 6
const JUMP_HEIGHT = 90
const OBSTACLE_WIDTH = 40
const OBSTACLE_GAP = 200

function App() {

  const [birdPos, setBirdPos] = useState(250)
  const [gameStarted, setGameStarted] = useState(false)
  const [obstacleHeight, setObstacleHeight] = useState(90)
  const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH - OBSTACLE_WIDTH)
  const bottomObstacleHeight = GAME_HEIGHT - OBSTACLE_GAP - obstacleHeight
  const [score, setScore] = useState(0)

  {/* BIRD MOVEMENT */}

  useEffect(() => {
    let timeId;
    if(gameStarted && birdPos < GAME_HEIGHT - BIRD_SIZE){
      timeId = setInterval(() => {
        setBirdPos(birdPos => birdPos + GRAVITY)
      }, 24)
    }

    return () => {
      clearInterval(timeId)
    }
  }, [birdPos, gameStarted])

  {/* OBSTACLES */}

  useEffect(() => {
    let obstacleId
    if(gameStarted && obstacleLeft >= 0 ){
      obstacleId = setInterval(() => {
        setObstacleLeft((obstacleLeft) => obstacleLeft - 5)
      }, 24)

      return () => {
        clearInterval(obstacleId)
      }

    }
    else{
      setObstacleLeft(GAME_WIDTH - OBSTACLE_WIDTH)
      setObstacleHeight(Math.floor(Math.random() * (GAME_HEIGHT - OBSTACLE_GAP)))
      setScore(score + 1)
    }
  }, [gameStarted, obstacleLeft])

  {/* HAS COLLIDED WITH AN OBSTACLE */}

  useEffect(() => {
    const hasCollisionTop = birdPos <=0 && birdPos < obstacleHeight 
    const hasCollisionBottom = birdPos <=500 && birdPos >= 500 - obstacleHeight
    if(obstacleLeft >= 0 && obstacleLeft <= OBSTACLE_WIDTH && (hasCollisionTop || hasCollisionBottom)){
      setGameStarted(false)
    }
  }) 

  {/* BIRD JUMP */}

  function handleKeyDown(event){
    if(event.keyCode === 32){
      jump()
    }
  }

  function handleClick(){
    jump()
  }

  const jump = () => {
    let newBirdPos = birdPos - JUMP_HEIGHT
    if(!gameStarted){
      setGameStarted(true)
      setScore(0)
    }
    if  (birdPos < 0){
      setBirdPos(0)
    }else{
      setBirdPos(newBirdPos)
    }
  }

  return (
    <Div onClick={handleClick} onKeyDown={handleKeyDown} tabIndex='0'>
      <GameBox width={GAME_WIDTH} heigth={GAME_HEIGHT}>
        <Obstacle 
          width={OBSTACLE_WIDTH}
          height={obstacleHeight}
          left={obstacleLeft}
        />
        <Obstacle 
          top={GAME_HEIGHT - (obstacleHeight + bottomObstacleHeight)}
          width={OBSTACLE_WIDTH}
          height={bottomObstacleHeight}
          left={obstacleLeft}
        />
        <Bird size={BIRD_SIZE} top={birdPos} />
      </GameBox>
      <span>{score}</span>
    </Div>
  )
}

export default App

const Div = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  &:focus{
    outline: none;
  }
  & span{
    font-size: 24px;
    color: #f1f1f1;
    position: absolute;
    margin: 25px;
  }
`;

const Bird = styled.div`
  position: absolute;
  background-color: red;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  top: ${(props) => props.top}px;
  border-radius: 50%;
`;

const GameBox = styled.div`
  height: ${(props => props.heigth)}px;
  width: ${(props => props.width)}px;
  overflow: hidden;
  background-color: blue;
`;

const Obstacle = styled.div`
  position: relative;
  top: ${(props) => props.top}px;
  background-color: green;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  left: ${(props) => props.left}px;
`
