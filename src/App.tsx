import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import { mount } from './utilities/show';
import { useAppSelector } from './hooks';
import Loading from './components/Loading';
import NotFound from './components/NotFound';

const Exams = lazy(() => import('./pages/Exams'));
const ExamDetails = lazy(() => import('./pages/ExamDetails'));
const Question = lazy(() => import('./pages/Question'));
const ExamResult = lazy(() => import('./pages/ExamResult'));

function App() {
  const { completedAt } = useAppSelector((state) => state.examProgress);
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Other Routes go here */}
        <Route path="/" element={<Exams />} />
        <Route path="/exam/:slug">
          <Route index element={<ExamDetails />} />
          <Route path=":questionId" element={<Question />} />
          {mount(completedAt !== null, <Route path="result" element={<ExamResult />} />)}
        </Route>

        <Route path="*" element={<NotFound item="Page" />} />
      </Routes>
    </Suspense>
  );
}

export default App;
