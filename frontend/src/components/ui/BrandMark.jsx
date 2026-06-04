const BrandMark = ({ size = "md" }) => {
  const sizeClass = size === "lg" ? "h-16 w-16 text-3xl" : "h-10 w-10 text-lg";

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full bg-[#8e570c] text-white shadow-sm ring-4 ring-[#EBC796]/25`}
    >
      <span className="italic leading-none" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
        tdc
      </span>
    </div>
  );
};

export default BrandMark;
