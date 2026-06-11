interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function SearchBar({ value = "", onChange }: SearchBarProps) {
  return (
    <div className="flex items-center gap-1.5 w-[604px] h-14 px-6 bg-white rounded-[--radius-full]">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className="flex-shrink-0"
      >
        <circle cx="8.5" cy="8.5" r="6" stroke="#717680" strokeWidth="1.25" />
        <path
          d="M13 13l4 4"
          stroke="#717680"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="Search restaurants, food and drink"
        className="flex-1 text-md-regular leading-[30px] tracking-[-0.02em] text-neutral-600 placeholder:text-neutral-500 bg-transparent outline-none"
      />
    </div>
  );
}
