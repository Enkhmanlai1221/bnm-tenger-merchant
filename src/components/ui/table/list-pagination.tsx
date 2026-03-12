import { usePagination } from '@/hooks/use-pagination'
import { useLanguage } from '@/providers/language';

type Props = {
  count: number;
  page: number;
  limit: number;
  onChange: (page: number) => void;
}

const ListWithPagination = ({ count, page, limit, onChange }: Props) => {
  const { translate } = useLanguage();
  const pagination = usePagination({
    total: Math.ceil((count || 0) / limit),
    initialPage: page,
    onChange: (page: number) => onChange(page),
  });

  return (
    <nav className="my-8 flex items-center justify-between px-4 sm:px-0">
      <div className="-mt-px flex w-0 flex-1">
        <a onClick={() => pagination.previous()} className="inline-flex cursor-pointer items-center rounded-md border-2 border-transparent px-2 py-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Өмнөх
        </a>
      </div>
      <div className="hidden space-x-2 md:-mt-px md:flex">
        {pagination.range.map((item, index) => {
          if (item === 'dots') {
            return (
              <a key={index} className="inline-flex cursor-default items-center rounded-md border-2 border-transparent px-2 py-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700" aria-current="page">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </a>
            )
          }
          
          if (item === page) {
            return (
              <a key={index} className="inline-flex cursor-default items-center rounded-md border-2 border-gray-500 px-2 text-sm font-medium text-gray-600" aria-current="page">
                {item}
              </a>
            )
          }

          return (
            <a key={index} onClick={() => pagination.setPage(item)} className="inline-flex cursor-pointer items-center rounded-md border-2 border-transparent px-2 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
              {item}
            </a>
          )
        })}
      </div>
      <div className="-mt-px flex w-0 flex-1 justify-end">
        <a onClick={() => pagination.next()} className="inline-flex cursor-pointer items-center rounded-md border-2 border-transparent px-2 py-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
          Дараах
          <svg xmlns="http://www.w3.org/2000/svg" className="ml-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </nav>
  )
}

export default ListWithPagination
