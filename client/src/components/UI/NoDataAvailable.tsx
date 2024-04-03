type Props = {
  className?: string;
};

const NoDataAvailable = ({ className }: Props) => {
  return (
    <div className={`p-3 text-center ${className}`}>
      <p className="text-sm text-gray-400 xxl:!text-lg">No data available</p>
    </div>
  );
};

export default NoDataAvailable;
