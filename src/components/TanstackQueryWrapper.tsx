// src/components/QueryClientWrapper.tsx

'use client'; // This is a client component

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient(); // Create QueryClient

const QueryClientWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

export default QueryClientWrapper;
