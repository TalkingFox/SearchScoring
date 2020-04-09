using Amazon.DynamoDBv2.DataModel;

public class UnitResult
{
    public string Request { get; set; }
    public string Returns { get; set; }
    public int Rank { get; set; }
}

public class TestResult
{
    [DynamoDBHashKey("id")]
    public string Id { get; set; }
    public Test Test { get; set; }
    public float MeanReciprocolRank { get; set; }
    public UnitResult[] Results { get; set; }
}