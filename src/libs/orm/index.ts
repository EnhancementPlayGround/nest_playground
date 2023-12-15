export type FindOptions = { page?: number; limit?: number; lock?: { mode: 'pessimistic_write' | 'pessimistic_read' } };

export const convertOptions = (options?: FindOptions) => {
  if (!options) {
    return {};
  }
  return {
    take: options?.limit,
    skip: ((options?.page || 1) - 1) * (options?.limit || 1),
    lock: options?.lock,
  };
};
