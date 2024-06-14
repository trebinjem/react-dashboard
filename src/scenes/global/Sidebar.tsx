import { useMediaQuery } from '../../hooks/useMediaQuery';
import { cn } from '../../lib/utils';
import { ChevronsLeft, LayoutDashboard, NotepadText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const MenuItems = [
	{
		title: 'Dashboard',
		to: '/',
		icon: <LayoutDashboard />,
	},
	{
		title: 'Tasks',
		to: '/tasks',
		icon: <NotepadText />,
	},
];

const Sidebar = () => {
	const currentPath = useLocation().pathname;
	const [isCollapse, setIsCollapse] = useState(false);
	const isMobile = useMediaQuery('(max-width: 768px)');

	useEffect(() => {
		if (isMobile) setIsCollapse(true);
	}, [isMobile, currentPath]);

	return (
		<div className={`${isCollapse ? 'w-20' : 'w-screen md:w-96'} z-50 absolute duration-300 h-dvh px-4 pb-8 pt-12 bg-slate-800 md:sticky top-0  transition-all flex flex-col  group`}>
			<div className={cn('text-primary rounded-l-lg absolute top-4 right-0 cursor-pointer  ml-auto p-2 bg-white')} onClick={() => setIsCollapse(!isCollapse)}>
				<ChevronsLeft className={cn('w-4 h-4 transition-transform', isCollapse && 'rotate-180')} />
			</div>
			<div className="text-white text-center font-bold text-5xl">{isCollapse ? 'L' : 'LOGO'}</div>
			<ul className="flex flex-col space-y-4 w-full mt-40">
				{MenuItems.map((item) => (
					<Link key={item.to} to={item.to}>
						<li className={cn('hover:bg-primary text-white flex mx-auto items-center p-2 space-x-4 rounded-md', isCollapse ? 'w-fit' : 'w-full', currentPath === item.to || (item.to !== '/' && currentPath.includes(item.to)) ? 'bg-primary' : '')}>
							{item.icon}
							<span className={` ${isCollapse ? 'hidden' : 'block'} `}>{item.title}</span>
						</li>
					</Link>
				))}
			</ul>
		</div>
	);
};
export default Sidebar;
