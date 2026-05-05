export const Loader = ({ text }: { text: string }) => {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 border-4 border-t-[#78A890] border-gray-300 rounded-full animate-spin" />
            <p className="text-sm opacity-70">{text}</p>
        </div>
    )
}

export const SkeletonLoader = ({ columns }: { columns: number }) => {
    return (
        <>
            {[...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                    {[...Array(columns)].map((_, ci) => (
                        <td key={ci} className="px-4 py-2">
                            <div className="h-5 bg-gray-200 rounded"></div>
                        </td>
                    ))}
                </tr>
            ))}
        </>
    )
}