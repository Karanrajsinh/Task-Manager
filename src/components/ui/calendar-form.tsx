"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

type PropTypes =
    {
        date: Date,
        setDate: React.Dispatch<React.SetStateAction<Date>>
    }

export function DueDateForm({ date, setDate }: PropTypes) {
    return (

        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        date! && "text-muted-foreground"
                    )}
                >
                    {date ? format(date, "PPP") : <span>Pick a due date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    defaultMonth={date}
                    onSelect={(date) => setDate(date || new Date())}
                    disabled={(date) => date < new Date()}
                    dayClassname="h-8 w-8"
                    initialFocus
                />
            </PopoverContent>
        </Popover>

    )
}

