import BalanceChart from "@/components/charts/BalanceChart";

export default function Dashboard() {
	return (
		<div className="align-center flex h-full w-full flex-col gap-10 p-6">
			<BalanceChart />
		</div>
	);
}
