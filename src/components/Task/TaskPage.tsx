import { promises as fs } from "fs"
import path from "path"
import { Metadata } from "next"
import { z } from "zod"

import { DataTable } from "../components/ui/TaskPage/data-table"
import { taskSchema } from "../db/data/schema"
import { columns } from "../components/ui/TaskPage/columns"

export const metadata: Metadata = {
    title: "Tasks",
    description: "A task and issue tracker build using Tanstack Table.",
}

// Simulate a database read for tasks.
async function getTasks() {
    const data = await fs.readFile(
        path.join(process.cwd(), "./src/db/data/tasks.json")
    )

    const tasks = JSON.parse(data.toString())

    return z.array(taskSchema).parse(tasks)
}

export default async function TaskPage() {
    const tasks = await getTasks()

    return (
        <>
            <div className="mt-10">
                <DataTable data={tasks} columns={columns} />
            </div>
        </>
    )
}
