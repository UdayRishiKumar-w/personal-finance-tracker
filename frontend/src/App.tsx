import { clsx } from "clsx/lite";
import { useState } from "react";
import reactLogo from "./assets/react.svg";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<div>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo as string} className={clsx(["logo react", "flex-row"])} alt="React logo" />
				</a>
			</div>
			<h2>Vite + React</h2>
			<div className="card">
				<button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
				<h1>
					Edit <code>src/App.tsx</code> and personal to test HMR
				</h1>
			</div>
			<p className="read-the-docs">Click on the Vite and React logos to learn more</p>
		</>
	);
}

export default App;
