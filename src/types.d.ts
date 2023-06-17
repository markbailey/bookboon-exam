interface Exam {
  id: string;
  title: string;
  description: string;
  category: string;
  slug: string;
  allocatedTime: number;
  passingPercent: number;
  questionCount: number;
}

interface Question {
  id: string;
  examId: string;
  question: string;
  options: string[];
  answer: number;
}

interface Answer {
  questionId: string;
  optionIndex: number;
  timeTaken: number;
}

// State
interface StoreState {
  examProgress: ExamProgressState;
}

interface ExamProgressState {
  examId: string | null;
  currentQuestion: Question | null;
  timedOutQuestionIds: string[];
  submittedAnswers: Answer[];
  score: number;
  allocatedTimePerQuestion: number;
  startedAt: number | null;
  completedAt: number | null;
  isLoading: boolean;
  error: Error | SerializedError | null;
}

// Thunks
interface StartExamParams {
  examId: string;
  slug: string;
}

interface NextQuestionParams {
  examId: string;
  currentQuestionId?: string;
}

//
interface QuestionResult {
  questionId: string;
  examId: string;
  skipped: boolean;
  timedOut: boolean;
  timeTaken: number;
  answer: number | null;
}

interface ExamResult {
  examId: string;
  dateTimeStarted: number | null;
  dateTimeCompleted: number | null;
  questionsAnswered: number;
  questionsSkipped: number;
  questionsTimedOut: number;
  score: number;
}

// API
type ExamQuery = Record<Pick<Exam, 'id' | 'slug'>, string>;
