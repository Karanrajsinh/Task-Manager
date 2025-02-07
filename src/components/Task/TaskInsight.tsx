import { Task } from "@/db/validation";

type PropTypes =
    {
        tasks: Task[],
        insight: 'Total' | 'In-Progress' | 'Completed' | 'Due-Today',

    }

export default function TaskInsight({ tasks }: PropTypes) {
    return (
        <div className="p-5 bg-white/50 dark:bg-primary/5 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-primary text-sm">Total Tasks</p>
                    <h3 className="text-2xl font-semibold mt-1">{tasks?.length || 0}</h3>
                </div>
                <div className="p-3 rounded-lg">
                    {/* <BsListTask size={20} className="text-primary" /> */}
                </div>
            </div>
        </div>
    )
}