export interface Assertion {
    Request: string;
    Returns: string;
}

export interface Test {
    Id: string;
    RequestFormat: string;
    CorrectnessFieldQuery: string;
    Assertions: Assertion[];
}