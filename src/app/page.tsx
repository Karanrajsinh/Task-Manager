"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModeToggle } from "@/components/ui/themeToggle";
import {
  CheckCircle,
  Clock,
  Rocket
} from "lucide-react";
import { LiaCalendar } from "react-icons/lia";
import Link from 'next/link';
import { UserButton, useUser } from "@clerk/nextjs";

export default function LandingPage() {

  const { user } = useUser()


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-black/50 shadow-sm">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex items-center space-x-4">
            <LiaCalendar className="text-2xl lg:text-4xl text-primary" />
            <h1 className="text-lg lg:text-2xl font-bold text-primary">Task Manager</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            {user ?
              <UserButton />
              : <Link href="/login">
                <Button className="bg-primary text-sm px-6 lg:text-base ">Login</Button>
              </Link>}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto text-center py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl lg:text-4xl md:text-6xl font-extrabold mb-6 text-primary leading-tight">
            Simplify Your Workflow, Amplify Your Productivity
          </h2>
          <p className="text-sm md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Manage tasks, track projects, and stay organized with our intuitive task management platform.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="group">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto py-20 px-4">
        <h3 className="text-xl lg:text-3xl font-bold text-center mb-12 text-primary">Key Features</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-primary" />
                <span>Task Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                View upcoming and today&apos;s tasks, search and categorize tasks efficiently.
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-primary" />
                <span>Project Tracking</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Organize tasks into projects, track progress, and manage deadlines.
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Rocket className="w-6 h-6 text-primary" />
                <span>Calendar View</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Visualize your tasks and projects with an intuitive calendar interface.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/10 py-20 text-center">
        <div className="container mx-auto">
          <h3 className="text-2xl lg:text-4xl font-bold mb-6 text-primary">Ready to Get Organized?</h3>
          <Link href="/dashboard">
            <Button size="lg" className="group">
              Start Managing Tasks
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto py-10 text-center border-t">
        <p className="text-muted-foreground">
          © 2025 Task Manager. Simplify Your Workflow.
        </p>
      </footer>
    </div>
  );
}