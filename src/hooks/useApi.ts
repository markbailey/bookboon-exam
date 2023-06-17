import { useCallback, useState } from 'react';

const BASE_URL = 'http://localhost:3000/';

const fetchRequest = (slug: string) =>
  fetch(`${BASE_URL}${slug}`).then((response) => response.json());

function useApi() {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((error: Error) => setError(error), [setError]);
  const fetchRecords = useCallback(
    <RT>(slug: string) => {
      setIsFetching(true);
      return fetchRequest(slug)
        .catch(handleError)
        .then<RT>((data: RT) => data)
        .finally(() => setIsFetching(false));
    },
    [setIsFetching, handleError]
  );

  const fetchCategories = useCallback(() => fetchRecords<string[]>('categories'), [fetchRecords]);
  const fetchExams = useCallback(() => fetchRecords<Exam[]>('exams'), [fetchRecords]);
  const fetchExamById = useCallback(
    (examId: string) => fetchRecords<Exam>(`exams/${examId}`),
    [fetchRecords]
  );

  const fetchQuestionsByExamId = useCallback(
    (examId: string) => fetchRecords<Question[]>(`questions?examId=${examId}`),
    [fetchRecords]
  );

  return {
    isFetching,
    error,
    fetchCategories,
    fetchExams,
    fetchExamById,
    fetchQuestionsByExamId,
  };
}

export default useApi;
