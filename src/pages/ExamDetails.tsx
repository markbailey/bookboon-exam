import { useNavigate, useParams } from 'react-router-dom';
import { resetExamProgress, startExam } from '../store';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useGetExamQuery } from '../services/api';
import NotFound from '../components/NotFound';
import Loading from '../components/Loading';
import { useEffect } from 'react';

function Exam() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentQuestion, isLoading } = useAppSelector((state) => state.examProgress);
  const { data: exam, isFetching } = useGetExamQuery({ slug: slug! }, { skip: slug === undefined });

  const onStartClick = () => {
    if (exam === undefined) return;
    sessionStorage.removeItem('persistexamProgress');
    dispatch(resetExamProgress());
    dispatch(startExam({ examId: exam.id, slug: exam.slug }));
  };

  useEffect(() => {
    if (currentQuestion !== null) navigate(`/exam/${slug}/${currentQuestion.id}`);
  }, [slug, currentQuestion, navigate]);

  if (isFetching) return <Loading />;
  else if (exam === undefined) return <NotFound item="Exam" />;

  return (
    <main className="p-4">
      <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
        {exam.title}
      </h1>

      <p className="font-light text-gray-500 lg:mb-4 sm:text-xl dark:text-gray-400">
        {exam.description}
      </p>

      <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
        <li>
          <div className="inline-block leading-none">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {exam.questionCount}
            </span>
            <br />
            <small>Multiple choice questions</small>
          </div>
        </li>

        <li>
          <div className="inline-block leading-none">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {Math.round(exam.allocatedTime / exam.questionCount)} seconds
            </span>
            <br />
            <small>Per question</small>
          </div>
        </li>

        <li>
          <div className="inline-block leading-none">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {exam.passingPercent}%
            </span>
            <br />
            <small>Percentage to pass</small>
          </div>
        </li>
      </ul>

      <hr />

      <strong>Before you start</strong>

      <ul>
        <li>You must complete this exam in a single session.</li>
        <li>You cannot pause the exam.</li>
        <li>You cannot go back to previous questions.</li>
        <li>You cannot skip questions.</li>
        <li>You cannot change your answers.</li>
        <li>
          Closing the browser window will result in any unanswered questions being counted as
          incorrect.
        </li>
      </ul>

      <button
        className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
        onClick={onStartClick}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Start Exam'}
      </button>
    </main>
  );
}

export default Exam;
