export function generateUUID(): string {
    return Date.now().toString(36);
}