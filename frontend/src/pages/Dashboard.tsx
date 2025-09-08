import BalanceChart from "../components/charts/BalanceChart";

export default function Dashboard() {
	return (
		<div className="p-6">
			<h1 className="mb-4 text-2xl">Dashboard</h1>
			<BalanceChart />
		</div>
	);
}
