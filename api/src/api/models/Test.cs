using Amazon.DynamoDBv2.DataModel;

public class Assertion
{
    public string Request { get; set; }
    public string Returns { get; set; }
}

public class Test
{

    [DynamoDBHashKey("id")]
    public string Id { get; set; }
    public string RequestFormat { get; set; }
    public string CorrectnessFieldQuery { get; set; }
    public Assertion[] Assertions { get; set; }
}