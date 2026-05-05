type AlertType = "success" | "info" | "warning" | "error"

type AlertProps = {
    type: AlertType,
    message: string,
    title?: string,
    classname?: string,
    classnameAlert?: string,
    noPadding?: boolean,
    noRounded?: boolean
}

const svgs = {
    success: (
        <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" className="h-5 w-5 flex-shrink-0 mr-2 text-green-600" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        </svg>
    ),
    info: (
        <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" className="h-5 w-5 flex-shrink-0 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        </svg>
    ),
    warning: (
        <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" className="h-5 w-5 flex-shrink-0 mr-2 text-yellow-600" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        </svg>
    ),
    error: (
        <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" className="h-5 w-5 flex-shrink-0 mr-2 text-red-600" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        </svg>
    )
} as const

const colorClasses: Record<AlertType, string> = {
  success: "bg-green-100 dark:bg-green-900 border-l-4 border-green-500 dark:border-green-700 text-green-900 dark:text-green-100 p-2 flex items-center transition duration-300 ease-in-out hover:bg-green-200 dark:hover:bg-green-800 transition",
  info: "bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500 dark:border-blue-700 text-blue-900 dark:text-blue-100 p-2 flex items-center transition duration-300 ease-in-out hover:bg-blue-200 dark:hover:bg-blue-800 transition",
  warning: "bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100 p-2 flex items-center transition duration-300 ease-in-out hover:bg-yellow-200 dark:hover:bg-yellow-800 transition",
  error: "bg-red-100 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-700 text-red-900 dark:text-red-100 p-2 flex items-center transition duration-300 ease-in-out hover:bg-red-200 dark:hover:bg-red-800 transition"
}


const Alerts = ({ type, title, message, classname, classnameAlert, noPadding, noRounded }: AlertProps) => {

    return (
        <div className={`space-y-2 ${classname ?? ""} ${noPadding ? "" : "p-4"} `}>
            <div role="alert" className={`${colorClasses[type]} ${classnameAlert ?? ""} ${noRounded ? "rounded-none" : "rounded-xl"} `}>
                {svgs[type]}

                <div className="flex flex-col">
                    <h4 className="text-sm font-semibold">{title}</h4>
                    <p className="text-xs font-semibold">{message}</p>
                </div>
            </div>
        </div>
    )
}

export default Alerts