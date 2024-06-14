import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import axios from 'axios';
import { Task } from '@/scenes/tasks/columns';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
	title: z.string().min(1, 'This field is required.'),
});

const UpdateTaskForm: React.FC<{ defaultValues: Task }> = ({ defaultValues }) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: defaultValues.title || '',
		},
	});

	const navigate = useNavigate();

	function isFieldRequired(fieldName: keyof typeof formSchema.shape): boolean {
		const fieldSchema = formSchema.shape[fieldName];
		return !!fieldSchema.minLength;
	}

	async function onSubmit(values: z.infer<typeof formSchema>) {
		await axios
			.patch(`https://jsonplaceholder.typicode.com/todos/${defaultValues.id}`, { data: values })
			.then(() => {
				alert(`Task ${defaultValues.id} updated successfully!`);
				navigate('/tasks');
			})
			.catch((error) => alert(error.message));
	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:w-2/4">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Task Name {isFieldRequired(field.name) && '*'}</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button disabled={form.formState.isSubmitting} type="submit" className="ml-auto">
					Update
				</Button>
			</form>
		</Form>
	);
};

export default UpdateTaskForm;
