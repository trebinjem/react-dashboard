import { ColumnDef } from '@tanstack/react-table';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { ArrowUpDown, Check, MoreHorizontal, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import TaskActionCell from './ActionCell';
import { formatDate } from '../../lib/utils';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';

export type Task = {
	id: string;
	userId: string;
	title: string;
	date: Date;
	completed: boolean;
};

export const columns: ColumnDef<Task>[] = [
	{
		accessorKey: 'id',
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Id
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: 'userId',
		header: 'User ID',
	},
	{
		accessorKey: 'title',
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Title
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: 'date',
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Deadline
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => <div>{formatDate(row.original.date)}</div>,
	},
	{
		accessorKey: 'completed',
		header: () => <div className="flex justify-center">Status</div>,
		cell: ({ row }) => (
			<div className="flex justify-center">
				{row.original.completed ? (
					<div className="text-white bg-green-500 p-2 flex text-center rounded-md">
						{' '}
						<Check className="w-4 mr-2" /> <span>Done</span>
					</div>
				) : (
					<div className="text-white bg-sky-500 p-2 flex text-center rounded-md">
						{' '}
						<Check className="w-4 mr-2" /> <span>In progress</span>
					</div>
				)}
			</div>
		),
	},
	// {
	// 	accessorKey: 'actions',
	// 	header: 'Actions',
	// 	cell: ({ row }) => <TaskActionCell id={row.original.id} />,
	// },
	{
		id: 'actions',
		header: 'Actions',
		enableHiding: false,
		cell: ({ row }) => {
			const task = row.original;

			const handleDeleteTask = async (id: string) => {
				await axios
					.delete(`https://jsonplaceholder.typicode.com/todos/${id}`)
					.then(() => {
						alert(`Task ${id} deleted successfully!`);
					})
					.catch((error) => console.log(error.message));
			};

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem onClick={() => navigator.clipboard.writeText(task.id)}>Copy task ID</DropdownMenuItem>
						<DropdownMenuSeparator />
						<Link to="/tasks/update" state={{ id: task.id }}>
							<DropdownMenuItem>Edit</DropdownMenuItem>
						</Link>
						<DropdownMenuItem onClick={() => handleDeleteTask(task.id)}>Delete</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
