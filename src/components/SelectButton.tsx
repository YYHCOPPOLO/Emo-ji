export default (props) => {
  const slot = props.children;
  const isHighLight = props.HighLight;

  return (
    <div
      bg-gray-100
      p-2
      rounded-md
      border
      transition-colors
      cursor-pointer
      hover="bg-red-100 border border-red-400"
      class={isHighLight ? "border-red-400 bg-red-100" : "border-transparent"}
    >
      {slot}
    </div>
  );
};
