"use client"

import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ui/themeToggle'
import { SignIn, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { LiaCalendar } from 'react-icons/lia'
import { redirect } from 'next/navigation'

export default function Home() {
    const { user } = useUser()

    if (user) {
        redirect('/dashboard')
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-black/50 shadow-sm">
                <div className="container mx-auto flex justify-between items-center p-4">
                    <div className="flex items-center space-x-4">
                        <LiaCalendar className="text-2xl lg:text-4xl text-primary" />
                        <h1 className="text-lg lg:text-2xl font-bold text-primary">Task Manager</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <ModeToggle />
                        <Link href="/">
                            <Button className="bg-primary text-sm px-6 lg:text-base">Home</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <div className='flex-grow flex justify-center items-center'>
                <SignIn
                    forceRedirectUrl={'/dashboard'}
                    routing='hash'
                />
            </div>
        </div>
    )
}