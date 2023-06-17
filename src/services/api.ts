// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const createQueryString = <T extends Record<string, string>>(params: T) => {
  const queryString = Object.entries(params);
  const searchParams = new URLSearchParams();
  queryString.forEach(([key, value]) => searchParams.set(key, value));
  return searchParams.toString();
};

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/' }),
  tagTypes: ['Exam', 'Exams', 'Questions'],
  endpoints: (builder) => ({
    getExams: builder.query<Exam[], void>({
      query: () => 'exams',
      providesTags: ['Exams'],
      keepUnusedDataFor: 60 * 60 * 1000, // 1 hour
    }),
    getExam: builder.query<Exam, ExamQuery>({
      query: (query: ExamQuery) => `exams?${createQueryString<ExamQuery>(query)}`,
      transformResponse: (response: Exam[]) => response[0],
      providesTags: ['Exam'],
      keepUnusedDataFor: 60 * 60 * 1000, // 1 hour
    }),
    getExamQuestions: builder.query<Question[], string>({
      query: (examId: string) => `questions?examId=${examId}`,
      transformResponse: (response: Question[]) => response.sort(() => Math.random() - 0.5),
      providesTags: ['Questions'],
      keepUnusedDataFor: 60 * 60 * 1000, // 1 hour
    }),
  }),
});

export const getExam = api.endpoints.getExam.initiate;
export const getExamQuestions = api.endpoints.getExamQuestions.initiate;
// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetExamQuery, useGetExamsQuery, useGetExamQuestionsQuery } = api;
