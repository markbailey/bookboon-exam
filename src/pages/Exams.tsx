import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import { useGetExamsQuery } from '../services/api';

function Exams() {
  const { data: exams, isFetching } = useGetExamsQuery();
  if (isFetching) return <Loading />;
  return (
    <div>
      <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
        Exams
      </h1>

      <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
        {exams?.map((exam) => (
          <li key={exam.id}>
            <div className="inline-block leading-none">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {exam.title}
              </span>
              <br />
              <Link to={`/exam/${exam.slug}`}>View Details</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Exams;
