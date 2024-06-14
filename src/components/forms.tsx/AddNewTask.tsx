import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import axios from 'axios';

const formSchema = z.object({
	title: z.string().min(1, 'This field is required.'),
});

export default function AddNewTask() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
		},
	});

	function isFieldRequired(fieldName: keyof typeof formSchema.shape): boolean {
		const fieldSchema = formSchema.shape[fieldName];
		return !!fieldSchema.minLength;
	}

	async function onSubmit(values: z.infer<typeof formSchema>) {
		await axios
			.post('https://jsonplaceholder.typicode.com/posts', {
				body: JSON.stringify(values),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
				},
			})
			.then((response) => alert(JSON.stringify(response.data)));
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
				<Button disabled={form.formState.isSubmitting} type="submit" className="mx-auto">
					Create
				</Button>
			</form>
		</Form>
	);
}
