'use client';

import { useMemo } from 'react';
import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem } from '../components/ui/pagination';
import { cn } from '../lib/utils';

interface PaginationProps<TData> {
	table: Table<TData>;
}

export default function CustomPagination<TData>({ table }: PaginationProps<TData>) {
	const pageCount: number = table.getPageCount();
	const currentPage = table.getState().pagination.pageIndex + 1;

	const handlePageChange = (pageNumber: number) => {
		table.setPageIndex(pageNumber - 1);
	};

	const visiblePageNumbers = useMemo(() => {
		const startPage = Math.max(0, currentPage === pageCount ? currentPage - 3 : currentPage - 2);
		const endPage = Math.min(pageCount, currentPage === 1 ? currentPage + 2 : currentPage + 1);

		return Array.from({ length: pageCount }, (_, i) => i + 1).slice(startPage, endPage);
	}, [currentPage, pageCount]);

	return (
		<div className="flex items-center space-x-6 lg:space-x-8">
			<Pagination className="flex items-center space-x-2">
				<PaginationContent>
					{table.getCanPreviousPage() && (
						<PaginationItem className="rounded-full flex p-0 h-5 w-5 text-primary" onClick={table.previousPage}>
							<ChevronLeft className="w-4 h-4 m-auto" />
						</PaginationItem>
					)}
					{/* {currentPage > 2 && <div>...</div>} */}

					{visiblePageNumbers.map((pageNumber: number) => {
						return (
							<PaginationItem className={cn('rounded-full  text-slate-500  text-sm  p-0 h-5 w-5 text-center', currentPage === pageNumber && 'bg-accent ')} key={pageNumber} onClick={() => handlePageChange(pageNumber)}>
								{pageNumber}
							</PaginationItem>
						);
					})}
					{/* {currentPage < pageCount - 1 && <div>...</div>} */}
					{table.getCanNextPage() && (
						<PaginationItem className="rounded-full p-0 flex h-5 w-5 text-primary" onClick={table.nextPage}>
							<ChevronRight className="w-4 h-4 m-auto" />
						</PaginationItem>
					)}
				</PaginationContent>
			</Pagination>
		</div>
	);
}
