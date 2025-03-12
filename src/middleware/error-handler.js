export class APIError extends Error {
    constructor(statusCode, message, code = 'INTERNAL_ERROR', details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.name = 'APIError';
    }
}
export function errorHandler(err, req, res, next) {
    console.error('Error:', err);
    if (err instanceof APIError) {
        res.status(err.statusCode).json({
            code: err.code,
            message: err.message,
            details: err.details
        });
        return;
    }
    // Default error response
    res.status(500).json({
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
}
