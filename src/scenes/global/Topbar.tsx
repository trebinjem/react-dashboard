import { formatDate } from '../../lib/utils';

interface TopbarProps {
	title: string;
}

const Topbar = ({ title }: TopbarProps) => {
	return (
		<div className="bg-primary shadow-sm justify-between flex md:py-6 py-3 px-6 md:px-12 items-center w-full">
			<h1 className="text-white">{title}</h1>
			<div className="self-center flex">
				<img src="/avatar.jpg" alt="user profile" className="w-12 mr-6 rounded-full " />

				<div className="text-white text-left hidden md:block">
					<p className="text-lg font-semibold">Jane Doe</p>
					<p className="text-sm">testuser@test.com</p>
				</div>
			</div>
		</div>
	);
};
export default Topbar;
