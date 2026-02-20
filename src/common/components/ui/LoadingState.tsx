import Spinner from "./Spinner";

export interface LoadingStateProps {
  message?: string;
}

const LoadingState = ({ message = "Caricamento..." }: LoadingStateProps) => {
  return (
    <div className="text-center py-12">
      <Spinner size="md" />
      <p className="text-gray-500 mt-3">{message}</p>
    </div>
  );
};

export default LoadingState;
