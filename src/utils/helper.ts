// biome-ignore lint/style/useImportType: <explanation>
import { IContainer } from 'src/interfaces/common.interface';
import { Context } from 'src/modules/context';

export function extractTimestampFromUUIDv7(uuid: string): Date {
	// split the UUID into its components
	const parts = uuid.split('-');

	// the second part of the UUID contains the high bits of the timestamp (48 bits in total)
	const highBitsHex = parts[0] + parts[1].slice(0, 4);

	// convert the high bits from hex to decimal
	// the UUID v7 timestamp is the number of milliseconds since Unix epoch (January 1, 1970)
	const timestampInMilliseconds = Number.parseInt(highBitsHex, 16);

	// convert the timestamp to a Date object
	const date = new Date(timestampInMilliseconds);

	// check if the date is valid
	if (Number.isNaN(date.getTime())) return null;

	return date;
}

export function createContainerResponse(container: IContainer): unknown[] {
	const res = Context.res.raw;

	res.setHeader('x-total-count', container.totalCount);
	res.setHeader('x-total-pages', container.totalPages);
	res.setHeader('x-page', container.page);
	res.setHeader('x-limit', container.limit);
	res.setHeader('x-sort-type', container.sortType);
	res.setHeader('x-sort-column', container.sortColumn);
	container.filters
		? res.setHeader('x-filters', JSON.stringify(container.filters))
		: undefined;

	return container.data;
}
