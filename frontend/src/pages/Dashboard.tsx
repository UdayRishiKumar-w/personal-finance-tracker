import BalanceChart from "../components/charts/BalanceChart";

export default function Dashboard() {
	return (
		<div className="flex flex-col align-center h-full w-full p-6 bg-white" place-items="center">
			<h1 className="mb-4 text-2xl text-black font-bold">Dashboard</h1>
			<BalanceChart />
		</div>
	);
}
