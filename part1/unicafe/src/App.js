import React, { useState } from 'react';

const Button = ({ onClick, text }) => (
	<button onClick={onClick}> {text}</button>
);

const Statistics = ({ good, neutral, bad }) => {
	if (good + neutral + bad === 0) {
		return <p>No feedback given</p>;
	}
	return (
		<div>
			<p>good {good}</p>
			<p>neutral {neutral}</p>
			<p>bad {bad}</p>

			<p> all {good + neutral + bad}</p>
			<p> average {(good - bad) / (good + neutral + bad)}</p>
			<p>positive {(good / (good + neutral + bad)) * 100}%</p>
		</div>
	);
};

function App() {
	const [good, setGood] = useState(0);
	const [neutral, setNeutral] = useState(0);
	const [bad, setBad] = useState(0);

	return (
		<div>
			<h2>give feedback</h2>
			<Button onClick={() => setGood(good + 1)} text={'good'} />
			<Button onClick={() => setNeutral(neutral + 1)} text={'neutral'} />
			<Button onClick={() => setBad(bad + 1)} text={'bad'} />
			<h2> statistics </h2>
			<Statistics good={good} neutral={neutral} bad={bad} />
		</div>
	);
}

export default App;
