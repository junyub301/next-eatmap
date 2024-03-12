"use client";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div className="W-FULL h-screen mx-auto pt-[10%] text-black text-center font-semibold">
                    다시 시도해주세요.
                </div>
                <button
                    className="mt-4 mx-auto bg-red-600 px-4 py-2.5 rounded-md hover::bg-red-500"
                    onClick={() => reset()}
                >
                    Try again
                </button>
            </body>
        </html>
    );
}
