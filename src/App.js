import "./App.css";
import React from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
	const [rollCount, setRollCount] = React.useState(0);
	const [dice, setDice] = React.useState(allNewDice());
	const [tenzies, setTenzies] = React.useState(false);

	React.useEffect(() => {
		const allHeld = dice.every((die) => die.isHeld);
		const firstValue = dice[0].value;
		const allSameValue = dice.every((die) => die.value === firstValue);
		if (allHeld && allSameValue) {
			setTenzies(true);
		}
	}, [dice]);

	function generateNewDie() {
		return {
			value: Math.ceil(Math.random() * 6),
			isHeld: false,
			id: nanoid(),
		};
	}

	function allNewDice() {
		const newDice = [];
		for (let i = 0; i < 10; i++) {
			newDice.push(generateNewDie());
		}
		return newDice;
	}

	function rollDice() {
		if (!tenzies) {
			setRollCount((prevRollCount) => prevRollCount + 1);
			setDice((oldDice) =>
				oldDice.map((die) => {
					return die.isHeld ? die : generateNewDie();
				})
			);
		} else {
			setRollCount(0);
			setTenzies(false);
			setDice(allNewDice());
		}
	}

	function holdDice(id) {
		setDice((oldDice) =>
			oldDice.map((die) => {
				return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
			})
		);
	}

	const diceElements = dice.map((die) => (
		<Die
			key={die.id}
			value={die.value}
			isHeld={die.isHeld}
			holdDice={() => holdDice(die.id)}
		/>
	));

	return (
		<main>
			{tenzies && <Confetti />}
			<h1 className="title">Tenzies</h1>
			<p className="instructions">
				Roll until all dice are the same. Click each die to freeze it at its
				current value between rolls.
			</p>
			<div className="dice-container">{diceElements}</div>
			<div>number of rolls: {rollCount}</div>
			<button className="roll-dice" onClick={rollDice}>
				{tenzies ? "New Game" : "Roll"}
			</button>
		</main>
	);
}
