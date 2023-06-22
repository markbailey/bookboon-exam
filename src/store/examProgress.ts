import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getExam, getExamQuestions } from '../services/api';

const initialState: ExamProgressState = {
  examId: null,
  currentQuestion: null,
  timedOutQuestionIds: [],
  submittedAnswers: [],
  score: 0,
  allocatedTimePerQuestion: 0,
  startedAt: null,
  completedAt: null,
  isLoading: false,
  error: null,
};

export const nextQuestion = createAsyncThunk(
  'exam/nextQuestion',
  async (params: NextQuestionParams, { dispatch }) => {
    const { examId, currentQuestionId } = params;
    const { data: questions = [] } = await dispatch(getExamQuestions(examId));
    const nextQuestionIndex = questions.findIndex((q) => q.id === currentQuestionId) + 1;
    return nextQuestionIndex < questions.length ? questions[nextQuestionIndex] : null;
  }
);

export const submitAnswer = createAsyncThunk(
  'exam/submitAnswer',
  async (params: Answer, { dispatch, getState }) => {
    const { examId, currentQuestion } = (getState() as StoreState).examProgress;
    let isCorrect = false;
    if (currentQuestion !== null && examId !== null) {
      isCorrect = currentQuestion.answer === params.optionIndex;
      await dispatch(nextQuestion({ examId, currentQuestionId: currentQuestion.id }));
    }
    return { ...params, isCorrect };
  }
);

export const questionTimedOut = createAsyncThunk(
  'exam/questionTimedOut',
  async (params: NextQuestionParams, { dispatch }) => {
    const { currentQuestionId } = params;
    await dispatch(nextQuestion(params));
    return currentQuestionId!;
  }
);

export const timeOutRemainingQuestions = createAsyncThunk(
  'exam/timeOutRemainingQuestions',
  async (_, { dispatch, getState }) => {
    const { examId, submittedAnswers, timedOutQuestionIds } = (getState() as StoreState)
      .examProgress;
    if (examId !== null) {
      const { data: questions = [] } = await dispatch(getExamQuestions(examId));
      // Get all unanswered questions and return their ids
      return questions
        .filter(
          (q) =>
            !submittedAnswers.some((a) => a.questionId === q.id) &&
            !timedOutQuestionIds.includes(q.id)
        )
        .map((q) => q.id);
    }

    return [];
  }
);

export const startExam = createAsyncThunk(
  'exam/startExam',
  async (params: StartExamParams, { dispatch }) => {
    const { examId, slug } = params;
    const { data: exam } = await dispatch(getExam({ slug }));

    if (exam === undefined) throw new Error('Exam not found');
    const allocatedTimePerQuestion = exam.allocatedTime / exam.questionCount;

    await dispatch(nextQuestion({ examId }));
    return { examId, allocatedTimePerQuestion };
  }
);

const examProgressSlice = createSlice({
  name: 'examProgress',
  initialState,
  reducers: {
    resetProgress: (state) => {
      state.examId = null;
      state.currentQuestion = null;
      state.timedOutQuestionIds = [];
      state.submittedAnswers = [];
      state.score = 0;
      state.allocatedTimePerQuestion = 0;
      state.startedAt = null;
      state.completedAt = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers(builder) {
    // Start exam
    builder.addCase(startExam.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(startExam.fulfilled, (state, action) => {
      const { examId, allocatedTimePerQuestion } = action.payload;
      // Reset the state if the exam has changed
      if (state.startedAt === null && state.examId !== examId) {
        state.startedAt = Date.now();
        state.completedAt = null;
      }

      state.examId = examId;
      state.allocatedTimePerQuestion = allocatedTimePerQuestion;
      state.isLoading = false;
      state.error = null;
    });

    builder.addCase(startExam.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    });

    // Submit answer
    builder.addCase(submitAnswer.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(submitAnswer.fulfilled, (state, action) => {
      const { isCorrect, ...answer } = action.payload;
      state.isLoading = false;
      state.submittedAnswers.push(answer);
      state.score += isCorrect ? 1 : 0;
      state.error = null;
    });

    builder.addCase(submitAnswer.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    });

    // Next question
    builder.addCase(nextQuestion.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(nextQuestion.fulfilled, (state, action) => {
      state.currentQuestion = action.payload;
      state.isLoading = false;
      state.error = null;

      // If there are no more questions, mark the exam as completed
      if (action.payload === null) state.completedAt = Date.now();
    });

    builder.addCase(nextQuestion.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    });

    // Question timed out
    builder.addCase(questionTimedOut.fulfilled, (state, action) => {
      state.timedOutQuestionIds.push(action.payload);
    });

    // Time out remaining questions
    builder.addCase(timeOutRemainingQuestions.fulfilled, (state, action) => {
      state.timedOutQuestionIds = [...state.timedOutQuestionIds, ...action.payload];
      state.currentQuestion = null;
      state.completedAt = Date.now();
      state.isLoading = false;
      state.error = null;
    });
  },
});

export const { resetProgress: resetExamProgress } = examProgressSlice.actions;
export default examProgressSlice.reducer;
