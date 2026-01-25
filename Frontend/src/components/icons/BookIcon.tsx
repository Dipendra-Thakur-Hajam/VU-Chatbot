export default function BookIcon({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M4 6C4 4.89543 4.89543 4 6 4H9C10.1046 4 11 4.89543 11 6V20H6C4.89543 20 4 19.1046 4 18V6Z"
                stroke="currentColor"
                strokeWidth="2"
                fill="currentColor"
                fillOpacity="0.05"
            />
            <path
                d="M20 6C20 4.89543 19.1046 4 18 4H15C13.8954 4 13 4.89543 13 6V20H18C19.1046 20 20 19.1046 20 18V6Z"
                stroke="currentColor"
                strokeWidth="2"
                fill="currentColor"
                fillOpacity="0.05"
            />
            <line
                x1="12"
                y1="4"
                x2="12"
                y2="20"
                stroke="currentColor"
                strokeWidth="2"
            />
            <path
                d="M7 9H9M7 12H9M15 9H17M15 12H17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.6"
            />
        </svg>
    );
}
