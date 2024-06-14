import { useEffect, useState } from 'react';
import UpdateTaskForm from '../../components/forms.tsx/UpdateTask';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Task } from './columns';

function UpdateTask() {
	const [defaultValues, setDefaultValues] = useState<Task>();
	let { state } = useLocation();

	useEffect(() => {
		async function fetchData() {
			await axios
				.get(`https://jsonplaceholder.typicode.com/todos/${state.id}`)
				.then((res) => setDefaultValues(res.data))
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
		}

		fetchData();
	}, []);

	if (!defaultValues) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container py-12">
			<UpdateTaskForm defaultValues={defaultValues} />
		</div>
	);
}

export default UpdateTask;
