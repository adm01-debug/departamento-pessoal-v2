export const paginate = <T>(arr: T[], page: number, pageSize: number) => arr.slice((page - 1) * pageSize, page * pageSize);
export const getPaginationInfo = (total: number, page: number, pageSize: number) => ({ totalPages: Math.ceil(total / pageSize), hasNext: page * pageSize < total, hasPrev: page > 1, start: (page - 1) * pageSize + 1, end: Math.min(page * pageSize, total) });
