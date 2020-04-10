using System;
using System.Collections.Generic;
using Amazon.DynamoDBv2.DataModel;

public class UnitResult
{
    public string Request { get; set; }
    public string Returns { get; set; }
    public int Rank { get; set; }
    public string Error { get; set; }
}

public class TestResult
{
    [DynamoDBHashKey("id")]
    public string Id { get; set; }
    public Test Test { get; set; }
    public DateTime DateRun { get; set; } = DateTime.UtcNow;
    public float MeanReciprocolRank { get; set; }
    public List<UnitResult> Results { get; set; }

    public TestResult()
    {
        Results = new List<UnitResult>();
    }
}