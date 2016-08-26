export interface Context {
    dirname: string;
    generateImportsService: Function;
    generateImportsMessage: Function;
    primitiveTypes: string[];
    dustTemplate: Function;
}
export default function (context: Context): {
    visitor: {
        Service(service: any, namespace: string[]): Promise<any>;
        Message(message: any, namespace: string[]): Promise<any>;
    };
};
