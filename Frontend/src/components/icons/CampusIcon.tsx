export default function CampusIcon({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Main building */}
            <rect
                x="6"
                y="9"
                width="12"
                height="11"
                stroke="currentColor"
                strokeWidth="2"
                fill="currentColor"
                fillOpacity="0.05"
            />
            {/* Roof/Triangle */}
            <path
                d="M4 9L12 4L20 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="currentColor"
                fillOpacity="0.1"
            />
            {/* Door */}
            <rect
                x="10"
                y="14"
                width="4"
                height="6"
                fill="currentColor"
                opacity="0.3"
            />
            {/* Windows */}
            <rect x="8" y="11" width="1.5" height="1.5" fill="currentColor" opacity="0.5" />
            <rect x="11" y="11" width="1.5" height="1.5" fill="currentColor" opacity="0.5" />
            <rect x="14.5" y="11" width="1.5" height="1.5" fill="currentColor" opacity="0.5" />
            {/* Flag pole */}
            <line x1="12" y1="4" x2="12" y2="1" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 1L15 2.5L12 4" fill="currentColor" opacity="0.7" />
        </svg>
    );
}
