interface IFilter {
  filter?: { [key: string]: unknown } | undefined;
  page: number;
  limit: number;
}

export default IFilter;
