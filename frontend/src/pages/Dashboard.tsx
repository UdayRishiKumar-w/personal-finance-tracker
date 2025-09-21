import BalanceChart from "@/components/charts/BalanceChart";
import TopBar from "@/components/TopBar";
import { clearCredentials } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	return (
		<div className="align-center flex h-full w-full flex-col gap-10 p-6">
			<TopBar
				text="Dashboard"
				onLogout={() => {
					sessionStorage.removeItem("token");
					sessionStorage.removeItem("user");
					dispatch(clearCredentials());
					navigate("/login", { replace: true });
				}}
			/>
			<BalanceChart />
		</div>
	);
}
