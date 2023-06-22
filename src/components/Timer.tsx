interface TimerProps {
  startTime: number;
  timeRemaining: number;
}

function Timer(props: TimerProps) {
  const { startTime, timeRemaining } = props;
  const width = (100 / startTime) * timeRemaining;

  return (
    <div>
      <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
        <div
          className="bg-blue-600 h-3 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
          style={{ width: `${width}%` }}
        />
      </div>
      <small>Time remaining: {Math.round(timeRemaining)} seconds</small>
    </div>
  );
}

export default Timer;
