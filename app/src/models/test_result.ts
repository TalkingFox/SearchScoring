import { Test } from "./test";

export interface UnitResult {
    Request: string;
    Returns: string;
    Rank: number;
}

export interface TestResult {
    Id: string;
    Test: Test;
    MeanReciprocolRank: number;
    Results: UnitResult[];
}