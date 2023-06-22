import { Link, useParams } from 'react-router-dom';
import { useAppSelector } from '../hooks';
import { useGetExamQuery } from '../services/api';
import Loading from '../components/Loading';

function ExamResult() {
  const { slug } = useParams();
  const { examId, score, timedOutQuestionIds, submittedAnswers, startedAt, completedAt } =
    useAppSelector((state) => state.examProgress);
  const { data: exam, isFetching } = useGetExamQuery({ slug: slug! }, { skip: slug === undefined });

  const totalQuestions = timedOutQuestionIds.length + submittedAnswers.length;
  const scorePercentage = Math.round((100 / totalQuestions) * score);
  const timeTaken = (completedAt! - startedAt!) / 1000;

  if (isFetching) return <Loading />;

  return (
    <div>
      <h1>Exam Result ({examId})</h1>
      <h2>{(exam?.passingPercent ?? 100) < scorePercentage ? 'Pass' : 'Fail'}</h2>
      <h2>
        Score: {score} / {totalQuestions} ({scorePercentage}%)
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
