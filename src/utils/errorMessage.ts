export const getErrorMessage = (error: Error | unknown): string => {
    if (error instanceof Error) {
        const errorMsg = error.message.toLowerCase();
        
        // Foreign key constraint violations
        if (errorMsg.includes('foreign key constraint')) {
            if (errorMsg.includes('user')) {
                return 'Invalid user access. Please check your authentication.';
            }
            if (errorMsg.includes('project')) {
                return 'The specified project does not exist or you don\'t have access to it.';
            }
            return 'Invalid reference detected. Please check your input data.';
        }

        // Unique constraint violations
        if (errorMsg.includes('duplicate key value')) {
            if (errorMsg.includes('name')) {
                return 'A project with this name already exists.';
            }
            if (errorMsg.includes('title')) {
                return 'A task with this title already exists in the project.';
            }
            return 'This item already exists. Please use a different name.';
        }

        // Permission errors
        if (errorMsg.includes('permission denied')) {
            return 'You don\'t have permission to perform this action.';
        }

        // Connection errors
        if (errorMsg.includes('connection') || errorMsg.includes('timeout')) {
            return 'Database connection error. Please try again later.';
        }

        // Neon specific errors
        if (errorMsg.includes('too many connections')) {
            return 'Server is currently busy. Please try again in a moment.';
        }
        if (errorMsg.includes('remaining connection slots are reserved')) {
            return 'Service is experiencing high load. Please try again shortly.';
        }

        // Data validation errors
        if (errorMsg.includes('invalid input syntax')) {
            return 'Invalid data format. Please check your input.';
        }
        if (errorMsg.includes('value too long')) {
            return 'Input exceeds maximum length allowed.';
        }
    }

    // Default error
    return 'An unexpected error occurred. Please try again later.';
};