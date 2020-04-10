using Amazon.DynamoDBv2.DataModel;
using System.Collections.Generic;

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
    public string Endpoint { get; set; }
    public List<SerializableKeyValuePair> Headers { get; set; }
    public List<Assertion> Assertions { get; set; }
}