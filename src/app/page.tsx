"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ModeToggle } from "@/components/ui/themeToggle";


export default function LandingPage() {

  return (
    <div className={`min-h-screen `}>
      {/* Header */}
      <header className="flex justify-between items-center p-6 shadow-md">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <ModeToggle />
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 ">
        <h2 className="text-5xl font-bold mb-4">Simplify Your Tasks, Stay Organized</h2>
        <p className="text-lg  max-w-2xl mx-auto">
          An easy-to-use task manager to keep your work and life in sync.
        </p>
        <Button className="mt-6  px-6 py-3">Get Started for Free</Button>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <h3 className="text-3xl font-bold text-center mb-10">Features</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent>
              <h4 className="text-xl font-bold">Minimalist Task Management</h4>
              <p className="">A clutter-free experience to manage your tasks efficiently.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h4 className="text-xl font-bold">Simple and Clean Interface</h4>
              <p className="">User-friendly design for seamless task management.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h4 className="text-xl font-bold">Easy Scheduling & Organization</h4>
              <p className="">Plan and organize your tasks effortlessly.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-20 ">
        <h3 className="text-4xl font-bold">Start Managing Your Tasks Today</h3>
        <Button className="mt-6  px-6 py-3">Sign Up Now</Button>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center ">
        <p>&copy; 2025 Task Manager. All rights reserved.</p>
      </footer>
    </div>
  );
}
