import { Link } from 'react-router-dom';
import { useAppSelector } from '../hooks';

function ExamResult() {
  const { examId, score, timedOutQuestionIds, submittedAnswers, startedAt, completedAt } =
    useAppSelector((state) => state.examProgress);

  const totalQuestions = timedOutQuestionIds.length + submittedAnswers.length;
  const scorePercentage = Math.round((100 / totalQuestions) * score);
  const timeTaken = (completedAt! - startedAt!) / 1000;

  return (
    <div>
      <h1>Exam Result ({examId})</h1>
      <h2>
        Score: {score} ({scorePercentage}%)
      </h2>

      <span>Completed on: {completedAt}</span>
      <br />
      <span>Time taken: {timeTaken}</span>
      <br />
      <span>
        Unanswered questions: {timedOutQuestionIds.length} / {totalQuestions}
      </span>
      <br />

      <Link
        to="/"
        className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
      >
        Return to home
      </Link>
    </div>
  );
}

export default ExamResult;
