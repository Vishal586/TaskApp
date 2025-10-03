import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, Shield, Zap } from 'lucide-react';

export default function HomePage() {
    const { user } = useAuth();

    const features = [
        {
            icon: CheckCircle,
            title: 'Task Management',
            description: 'Create, organize, and track your tasks with ease.',
        },
        {
            icon: Users,
            title: 'User Authentication',
            description: 'Secure login and registration with JWT tokens.',
        },
        {
            icon: Shield,
            title: 'Data Security',
            description: 'Your data is protected with industry-standard security.',
        },
        {
            icon: Zap,
            title: 'Fast & Responsive',
            description: 'Built with modern technologies for optimal performance.',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Welcome to{' '}
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            TaskApp
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        A modern, scalable web application for managing your tasks and staying organized.
                        Built with React, Node.js, and MongoDB for optimal performance and security.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {user ? (
                            <Link to="/dashboard">
                                <Button size="lg" className="text-lg px-8 py-3">
                                    Go to Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/register">
                                    <Button size="lg" className="text-lg px-8 py-3">
                                        Get Started
                                    </Button>
                                </Link>
                                <Link to="/login">
                                    <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                                        Sign In
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Everything you need to stay organized
                    </h2>
                    <p className="text-lg text-gray-600">
                        Powerful features designed to help you manage tasks efficiently
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                    <feature.icon className="h-6 w-6 text-blue-600" />
                                </div>
                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">
                                    {feature.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            {!user && (
                <div className="bg-blue-600 text-white py-16">
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold mb-4">
                            Ready to get organized?
                        </h2>
                        <p className="text-xl mb-8 opacity-90">
                            Join thousands of users who trust TaskApp to manage their daily tasks.
                        </p>
                        <Link to="/register">
                            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                                Start Free Today
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}