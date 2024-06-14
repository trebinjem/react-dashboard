import { Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './scenes/global/Sidebar';
import { useEffect, useState } from 'react';
import Dashboard from './scenes/dashboard';

import Tasks from './scenes/tasks';
import Topbar from './scenes/global/Topbar';
import AddNewTaskForm from './scenes/tasks/add-new';
import UpdateTaskForm from './scenes/tasks/update';
import Auth from './app/auth';

function App() {
	const [title, setTitle] = useState('');
	const location = useLocation();

	useEffect(() => {
		setTitle(generateTitleFromPathname(location.pathname));
	}, [location]);

	function generateTitleFromPathname(pathname: string) {
		if (pathname === '/') return 'Dashboard';
		return pathname
			.split('/')
			.filter(Boolean)
			.map((part) =>
				part
					.replace(/-/g, ' ') // Replace dashes with spaces
					.split(' ')
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join(' '),
			)
			.join(' - ');
	}

	return (
		<div className="relative md:flex md:flex-1 md:flex-grow">
			<Sidebar />
			<main className={`relative w-[calc(100vw-80px)] ml-20 md:ml-0 md:w-full h-dvh overflow-y-scroll`}>
				<Topbar title={title} />
				<div className="w-full md:py-12 md:px-8">
					<Routes>
						{/* <Route path="/" element={<Layout />}> */}
						<Route index element={<Dashboard />} />
						<Route path="/tasks" element={<Tasks />} />
						<Route path="/tasks/add-new" element={<AddNewTaskForm />} />
						<Route path="/tasks/update" element={<UpdateTaskForm />} />
						<Route path="/auth" element={<Auth />} />
					</Routes>
				</div>
			</main>
		</div>
	);
}

export default App;
