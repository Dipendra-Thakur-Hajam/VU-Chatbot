export default function LibraryIcon({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <rect
                x="3"
                y="11"
                width="18"
                height="10"
                rx="1"
                stroke="currentColor"
                strokeWidth="2"
                fill="currentColor"
                fillOpacity="0.05"
            />
            <path
                d="M5 11V6C5 5.44772 5.44772 5 6 5H8C8.55228 5 9 5.44772 9 6V11"
                stroke="currentColor"
                strokeWidth="2"
            />
            <path
                d="M10 11V8C10 7.44772 10.4477 7 11 7H13C13.5523 7 14 7.44772 14 8V11"
                stroke="currentColor"
                strokeWidth="2"
            />
            <path
                d="M15 11V6C15 5.44772 15.4477 5 16 5H18C18.5523 5 19 5.44772 19 6V11"
                stroke="currentColor"
                strokeWidth="2"
            />
            <rect
                x="2"
                y="21"
                width="20"
                height="1"
                fill="currentColor"
            />
            <path
                d="M6 11V13M10 11V13M14 11V13M18 11V13"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity="0.5"
            />
        </svg>
    );
}
