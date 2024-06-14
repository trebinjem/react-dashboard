import DataTable from '../../components/ui/data-table';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import { Task, columns } from '../tasks/columns';
import { getRandomDate } from '../../lib/utils';

interface LabelProps {
	cx: number;
	cy: number;
	midAngle: number;
	innerRadius: number;
	outerRadius: number;
	percent: number;
	index: number;
}

const COLORS = ['#00C49F', '#7dd3fc'];
const RADIAN = Math.PI / 180;

const Dashboard = () => {
	const [data, setData] = useState<Task[]>([]);

	useEffect(() => {
		async function fetchData() {
			await axios
				.get(`https://jsonplaceholder.typicode.com/todos`)
				.then((res) => setData(res.data.map((task: Task) => ({ ...task, date: getRandomDate(new Date(2020, 0, 1), new Date()) }))))
				.catch((error: AxiosError) => {
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

	const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: LabelProps) => {
		const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
		const x = cx + radius * Math.cos(-midAngle * RADIAN);
		const y = cy + radius * Math.sin(-midAngle * RADIAN);

		return (
			<text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
				{`${(percent * 100).toFixed(0)}%`}
			</text>
		);
	};

	function aggregateTaskCounts(): { name: string; total: number }[] {
		const counts = { completed: 0, notCompleted: 0 };
		data.forEach((task: Task) => {
			if (task.completed) {
				counts.completed += 1;
			} else {
				counts.notCompleted += 1;
			}
		});
		return [
			{ name: 'completed', total: counts.completed },
			{ name: 'in progress', total: counts.notCompleted },
		];
	}

	const pieData = aggregateTaskCounts();

	const BarChartData = () => {
		const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

		type ChartDataResult = {
			[key: string]: {
				date: string;
				completed: number;
				in_progress: number;
			};
		};

		const result = data.reduce((acc: ChartDataResult, task) => {
			const monthIndex = task.date.getMonth();
			const monthName = months[monthIndex];
			if (!acc[monthName]) {
				acc[monthName] = { date: monthName, completed: 0, in_progress: 0 };
			}
			if (task.completed) {
				acc[monthName].completed += 1;
			} else {
				acc[monthName].in_progress += 1;
			}
			return acc;
		}, {});

		const unsortedArray = Object.values(result);
		const sortedArray = unsortedArray.sort((a, b) => months.indexOf(a.date) - months.indexOf(b.date));

		return sortedArray;
	};

	return (
		<div className="container py-6">
			<div className="grid grid-flow-row grid-cols-1 md:grid-cols-12 gap-6">
				<div className=" bg-white p-6 rounded-md shadow-md col-span-1 md:col-span-3 h-96">
					<h2 className="mb-4">Tasks Counts</h2>
					<ResponsiveContainer width="100%" height="100%">
						<PieChart width={400} height={400}>
							<Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={100} fill="#8884d8" dataKey="total">
								{pieData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
								))}
							</Pie>
							<Tooltip />
						</PieChart>
					</ResponsiveContainer>
				</div>
				<div className="bg-white p-6 rounded-md shadow-md col-span-1 md:col-span-9 h-96">
					<h2 className="mb-4">Last Tasks</h2>
					<DataTable columns={columns} data={data.slice(0, 3)} />
				</div>
				<div className=" bg-white p-6 rounded-md shadow-md col-span-1 md:col-span-12 h-96">
					<h2 className="mb-4">Tasks completed by month</h2>
					<ResponsiveContainer width="100%" height="85%">
						<BarChart
							title="Task Complation by Month"
							width={1400}
							height={400}
							data={BarChartData()}
							margin={{
								top: 5,
								right: 30,
								left: 20,
								bottom: 5,
							}}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Bar dataKey="completed" fill={COLORS[0]} activeBar={<Rectangle fill="teal" stroke="" />} />
							<Bar dataKey="in_progress" fill={COLORS[1]} activeBar={<Rectangle fill="lightblue" stroke="" />} />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
};
export default Dashboard;
