export class ApiResponse {
    static success(data: any, message?: string) {
        return {
            success: true,
            message,
            data
        }
    }
}