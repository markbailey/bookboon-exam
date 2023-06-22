import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { questionTimedOut, submitAnswer } from '../store';
import { mount } from '../utilities/show';
import { useAppDispatch, useAppSelector } from '../hooks';
import Loading from '../components/Loading';
import NotFound from '../components/NotFound';
import useTimer from '../hooks/useTimer';
import { timeOutRemainingQuestions } from '../store/examProgress';
import Timer from '../components/Timer';

function Question() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const { questionId, slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { examId, currentQuestion, allocatedTimePerQuestion, completedAt, isLoading } =
    useAppSelector((state) => state.examProgress);

  const onTimedOut = useCallback(() => {
    if (examId === null || currentQuestion === null) return;
    dispatch(questionTimedOut({ examId, currentQuestionId: currentQuestion.id }));
  }, [examId, currentQuestion, dispatch]);

  const {
    timeRemaining,
    reset: resetTimer,
    stop: stopTimer,
  } = useTimer(allocatedTimePerQuestion, onTimedOut);

  const onOptionChange = (event: ChangeEvent<HTMLInputElement>) =>
    setSelectedOption(parseInt(event.target.value, 10));

  const onSubmitClick = () => {
    if (selectedOption === null || currentQuestion === null) return;
    const timeTaken = allocatedTimePerQuestion - timeRemaining;
    const answer = { questionId: currentQuestion.id, optionIndex: selectedOption, timeTaken };
    stopTimer();
    dispatch(submitAnswer(answer));
  };

  useEffect(() => {
    window.addEventListener('beforeunload', (e) => {
      console.log('beforeunload', e);
      dispatch(timeOutRemainingQuestions());
    });
  }, [dispatch]);

  useEffect(() => {
    if (currentQuestion === null && completedAt !== null)
      navigate(`/exam/${slug}/result`, { replace: true });
    else if (currentQuestion !== null && currentQuestion.id !== questionId)
      navigate(`/exam/${slug}/${currentQuestion.id}`, { replace: true });
  }, [currentQuestion, completedAt, questionId, slug, navigate]);

  useEffect(() => {
    setSelectedOption(null);
    if (questionId !== undefined) resetTimer();
    else stopTimer();
  }, [questionId, resetTimer, stopTimer, setSelectedOption]);

  if (isLoading) return <Loading />;
  else if (currentQuestion === null && completedAt === null) return <NotFound item="Question" />;

  return (
    <div>
      <h1>{currentQuestion?.question}</h1>
      {mount(
        allocatedTimePerQuestion > 0,
        <Timer startTime={allocatedTimePerQuestion} timeRemaining={timeRemaining} />
      )}

      <ul>
        {currentQuestion?.options.map((option, index) => (
          <li key={index}>
            <input
              type="radio"
              id={option}
              name="option"
              value={index}
              checked={selectedOption === index}
              onChange={onOptionChange}
            />

            <label htmlFor={option}>{option}</label>
          </li>
        ))}
      </ul>

      <button onClick={onSubmitClick} disabled={selectedOption === undefined}>
        Submit
      </button>
    </div>
  );
}

export default Question;
