export default (props) => {
  const slot = props.children;
  return (
    <div
      bg-gray-100
      p-2
      rounded-md
      border
      border-transparent
      transition-colors
      cursor-pointer
      hover="bg-red-100 border border-red-400"
    >
      {slot}
    </div>
  );
};
