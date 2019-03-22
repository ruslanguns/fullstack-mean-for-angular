declare class ErrorReporter {
    private apiKey;
    constructor(apiKey: string);
    report(err: Error): void;
}
