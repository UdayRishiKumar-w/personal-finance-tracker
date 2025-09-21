const Loader = ({ text = "Loading..." }: { text?: string }) => {
	return (
		<div className="mask">
			<div className="mask-wrapper">
				<div className="mask-content">
					<div className="spinner spinning fade">
						<span className="spinner-bar"></span>
						<span className="spinner-bar spinner-bar1"></span>
						<span className="spinner-bar spinner-bar2"></span>
						<span className="spinner-bar spinner-bar3"></span>
					</div>
					<span className="text">{text}</span>
				</div>
			</div>
		</div>
	);
};

export default Loader;
