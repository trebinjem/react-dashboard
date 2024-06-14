import { EllipsisVertical, PencilIcon, Trash } from 'lucide-react';
import { Button } from '../../components/ui/button';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const TaskActionCell: React.FC<{ id: string }> = ({ id }) => {
	const navigate = useNavigate();
	const [showActions, setShowActions] = useState(false);

	const handleDeleteTask = async (id: string) => {
		await axios
			.delete(`https://jsonplaceholder.typicode.com/todos/${id}`)
			.then(() => {
				alert(`Task ${id} deleted successfully!`);
				navigate(0);
			})
			.catch((error) => console.log(error.message));
	};

	return (
		<div className="flex gap-2 text-primary  relative">
			<Button variant={'ghost'} size={'icon'} onClick={() => setShowActions(!showActions)}>
				<EllipsisVertical className="w-4 h-4" />
			</Button>
			<div className={`${showActions ? 'block' : 'hidden'} absolute shadow p-4 rounded-md bg-white`}>
				<Button variant={'ghost'} size={'icon'} onClick={() => handleDeleteTask(id)}>
					<Trash className="w-4 h-4" />
					<span>Delete</span>
				</Button>
				<Link to="/tasks/update" state={{ id: id }}>
					<Button variant={'ghost'} size={'icon'}>
						<PencilIcon className="w-4 h-4 " />
						<span>Edit</span>
					</Button>
				</Link>
			</div>
		</div>
	);
};
export default TaskActionCell;
