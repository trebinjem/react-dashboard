import { useEffect, useState } from 'react';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, Row, SortingState, useReactTable, VisibilityState } from '@tanstack/react-table';
import Pagination from '../Pagination';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	dataName?: string;
	onSelected?: (original: any) => void;
	globalActions?: React.ReactNode[];
	search?: boolean;
}

export default function DataTable<TData, TValue>({ columns, data, dataName, onSelected, globalActions, search }: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});

	const handleRowSelectionChange = () => {
		const selectedData = table.getSelectedRowModel().rows.map((row: Row<TData>) => row.original);
		if (onSelected) onSelected(selectedData);
	};

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		enableGlobalFilter: true,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	useEffect(() => {
		if (rowSelection) {
			handleRowSelectionChange();
		}
	}, [rowSelection]);

	return (
		<>
			<div className="rounded-md">
				{search && (
					<div className="flex items-center justify-between py-4">
						<div className="flex space-x-4 items-center">
							<Input placeholder={`Search ${dataName ? dataName : null}...`} onChange={(event: React.ChangeEvent<HTMLInputElement>) => table.setGlobalFilter(event.target.value)} className="max-w-72" />
						</div>
						<div>{globalActions}</div>
					</div>
				)}

				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className="bg-primary hover:!bg-primary">
								{headerGroup.headers.map((header) => {
									return (
										<TableHead className=" !text-white" key={header.id}>
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className=" hover:bg-slate-100">
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>

				{data.length > 4 && (
					<div className="flex items-center justify-end space-x-2 py-4">
						<>
							<div className="flex items-center space-x-2">
								<div>
									<Select
										value={`${table.getState().pagination.pageSize}`}
										onValueChange={(value) => {
											table.setPageSize(Number(value));
										}}>
										<SelectTrigger className=" w-[72px] h-7 rounded-md">
											<SelectValue placeholder={table.getState().pagination.pageSize} />
										</SelectTrigger>
										<SelectContent side="top">
											{[10, 20, 50].map((pageSize) => (
												<SelectItem key={pageSize} value={`${pageSize}`}>
													{pageSize}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div>of {table.getFilteredRowModel().rows.length} | </div>
							</div>
							<Pagination table={table} />
						</>
					</div>
				)}
			</div>
		</>
	);
}
