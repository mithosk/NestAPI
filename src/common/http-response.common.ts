export interface HttpResponse {
	set(key: string, value: string): HttpResponse
	json<T>(body: T): HttpResponse
}