export default (props) => {
  const slot = props.children;
  const isHighLight = props.highlight;

  return (
    <div
      bg-gray-100
      p-2
      rounded-md
      border
      transition-colors
      cursor-pointer
      hover="bg-red-100 border border-red-400"
      class={
        isHighLight()
          ? "bg-violet-100 border-violet-400"
          : "bg-neutral-100 dark:bg-neutral-600 border-transparent"
      }
      onClick={props.onClick}
    >
      {slot}
    </div>
  );
};
