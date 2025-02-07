"use client"

import { ModeToggle } from '@/components/ui/themeToggle'
import { SignIn, useUser } from '@clerk/nextjs'

export default function Home() {
    const { user } = useUser()

    if (!user) {

        return (
            <div className='h-screen w-screen flex justify-center items-center'>
                <ModeToggle />
                <SignIn
                    fallbackRedirectUrl={'/dashboard'}
                    appearance={
                        {
                            elements:
                            {
                                formButtonPrimary: 'bg-secondary  hover:text-white text-black dark:bg-primary/40 dark:text-primary',
                                formFieldLabel: 'text-primary',
                                card: 'dark:bg-primary/5 text-primary',
                                headerTitle: 'text-primary',
                                socialButtonsBlockButton: 'text-primary bg-secondary dark:bg-primary/20 p-2',
                                footerItem: 'bg-red-400',

                            }
                        }
                    } routing='hash' />
            </div>)

    }

    return <div>Welcome!</div>
}