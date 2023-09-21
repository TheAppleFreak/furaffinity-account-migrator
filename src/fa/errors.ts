export class FaBaseError extends Error {
    public code: number;
    public type: string;
    public data: any;

    constructor(message: string, code: number, type: string, data?: any) {
        super(message);
        this.name = "FABaseError";
        this.code = code;
        this.type = type;
        this.data = data;
    }
}