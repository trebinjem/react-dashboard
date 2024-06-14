import axios from 'axios';
import { Task, columns } from './columns';
import DataTable from '../../components/ui/data-table';
import { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';
import { getRandomDate } from '../../lib/utils';

export default function Tasks() {
	const [data, setData] = useState<any[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			await axios
				.get(`https://jsonplaceholder.typicode.com/todos`)
				.then((res) => setData(res.data.map((task: Task) => ({ ...task, date: getRandomDate(new Date(2020, 0, 1), new Date()) }))))
				.catch((error) => {
					if (error.response) {
						console.log(error.response.data);
						console.log(error.response.status);
						console.log(error.response.headers);
					} else if (error.request) {
						console.log(error.request);
					} else {
						console.log('Error', error.message);
					}
					console.log(error.config);
				});
		};

		fetchData();
	}, []);

	return (
		<div className="container py-12">
			<div className="mb-6">
				<Link to="/tasks/add-new">
					<Button color="bg-primary">
						Add New <PlusCircle className="ml-2" />
					</Button>
				</Link>
			</div>
			<DataTable search dataName="Tasks" columns={columns} data={data} />
		</div>
	);
}
