import { useCallback, useEffect, useMemo, useState } from 'react';
import useApi from './useApi';

const EMPTY_EXAM_RESULT = {
  examId: '',
  dateTimeStarted: null,
  dateTimeCompleted: null,
  questionsAnswered: 0,
  questionsSkipped: 0,
  questionsTimedOut: 0,
  score: 0,
} as const;

function useExam(examId?: string) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
  const [examResult, setExamResult] = useState<ExamResult>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>();
  const { isFetching, error, fetchQuestionsByExamId } = useApi();

  const currentQuestion = useMemo(() => {
    return currentQuestionIndex !== undefined ? questions[currentQuestionIndex] ?? null : null;
  }, [questions, currentQuestionIndex]);

  const onQuestionAnswered = useCallback(
    (answer: number, timeTaken: number) => {
      if (currentQuestion !== null) {
        const newQuestionResult = {
          questionId: currentQuestion.id,
          examId: currentQuestion.examId,
          skipped: false,
          timedOut: false,
          timeTaken,
          answer,
        };

        setQuestionResults((prevState) => [...prevState, newQuestionResult]);
        setCurrentQuestionIndex((prevState) => (prevState !== undefined ? prevState + 1 : 0));
        setExamResult((prevState) => {
          const newState = prevState ?? EMPTY_EXAM_RESULT;
          const answeredCount = newState.questionsAnswered + 1;
          const score = newState.score + (answer === currentQuestion.answer ? 1 : 0);
          const dateTimeCompleted =
            answeredCount + newState.questionsTimedOut === questions.length
              ? new Date().valueOf()
              : null;

          return { ...newState, dateTimeCompleted, questionsAnswered: answeredCount, score };
        });
      }
    },
    [questions, currentQuestion, setQuestionResults, setCurrentQuestionIndex, setExamResult]
  );

  const onQuestionSkipped = useCallback(() => {
    if (currentQuestion !== null) {
      const newQuestionResult = {
        questionId: currentQuestion.id,
        examId: currentQuestion.examId,
        skipped: true,
        timedOut: false,
        timeTaken: 0,
        answer: null,
      };

      setQuestionResults((prevState) => [...prevState, newQuestionResult]);
      setCurrentQuestionIndex((prevState) => (prevState !== undefined ? prevState + 1 : 0));
      setExamResult((prevState) => {
        const newState = prevState ?? EMPTY_EXAM_RESULT;
        const skippedCount = newState.questionsSkipped + 1;
        const dateTimeCompleted =
          newState.questionsAnswered + newState.questionsTimedOut === questions.length
            ? new Date().valueOf()
            : null;

        return { ...newState, dateTimeCompleted, questionsSkipped: skippedCount };
      });
    }
  }, [currentQuestion, setQuestionResults, setCurrentQuestionIndex, setExamResult]);

  const onQuestionTimedOut = useCallback(() => {
    if (currentQuestion !== null) {
      const newQuestionResult = {
        questionId: currentQuestion.id,
        examId: currentQuestion.examId,
        skipped: false,
        timedOut: true,
        timeTaken: 0,
        answer: null,
      };

      setQuestionResults((prevState) => [...prevState, newQuestionResult]);
      setCurrentQuestionIndex((prevState) => (prevState !== undefined ? prevState + 1 : 0));
      setExamResult((prevState) => {
        const newState = prevState ?? EMPTY_EXAM_RESULT;
        const timedOutCount = newState.questionsTimedOut + 1;
        const dateTimeCompleted =
          newState.questionsAnswered + timedOutCount === questions.length
            ? new Date().valueOf()
            : null;

        return { ...newState, dateTimeCompleted, questionsTimedOut: timedOutCount };
      });
    }
  }, [currentQuestion, setQuestionResults, setCurrentQuestionIndex, setExamResult]);

  useEffect(() => {
    if (examId !== undefined)
      fetchQuestionsByExamId(examId).then((questions) => {
        // randomize the order of the questions
        const sortedQuestions = questions.sort(() => Math.random() - 0.5);
        const newExamResult = {
          examId,
          dateTimeStarted: new Date().valueOf(),
          dateTimeCompleted: null,
          questionsAnswered: 0,
          questionsSkipped: 0,
          questionsTimedOut: 0,
          score: 0,
        };

        setQuestions(sortedQuestions);
        setExamResult(newExamResult);
        setCurrentQuestionIndex(0);
      });
  }, [examId, fetchQuestionsByExamId, setQuestions, setCurrentQuestionIndex, setExamResult]);

  return {
    isLoading: isFetching,
    result: examResult,
    currentQuestion,
    currentQuestionIndex,
    totalQuestionCount: questions.length,
    error,
    onQuestionAnswered,
    onQuestionSkipped,
    onQuestionTimedOut,
  };
}

export default useExam;
