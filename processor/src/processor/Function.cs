using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Amazon.Lambda.Core;
using Amazon.DynamoDBv2;
using Microsoft.Extensions.Configuration;
using Amazon.DynamoDBv2.DataModel;
using System.Net.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]

namespace processor
{
    public class Function
    {
        private readonly string m_testsTableName;
        private readonly string m_testResultsTableName;
        private readonly IAmazonDynamoDB m_dynamo;
        private string m_executionId;
        public Function()
        {
            var builder = new ConfigurationBuilder();
            builder.AddEnvironmentVariables();
            var config = builder.Build();

            m_testsTableName = config.GetValue<string>("tests_table");
            m_testResultsTableName = config.GetValue<string>("test_results_table");
            m_dynamo = new AmazonDynamoDBClient();
        }

        public async Task FunctionHandler(JobRequest request, ILambdaContext context)
        {
            m_executionId = request.ExecutionId;
            var test = await GetTest(request.TestId);
            var results = await ExecuteTest(test);
            await SaveResults(results);
        }

        private async Task<Test> GetTest(string testId)
        {
            Console.WriteLine("TestId: " + testId);
            using (var context = new DynamoDBContext(m_dynamo))
            {
                var config = new DynamoDBOperationConfig();
                config.OverrideTableName = m_testsTableName;

                return await context.LoadAsync<Test>(testId, config);
            }
        }

        private async Task<TestResult> ExecuteTest(Test test)
        {
            try
            {
                var tasks = new List<Task<HttpResponseMessage>>();
                var responses = new List<HttpResponseMessage>();
                using (var client = new HttpClient())
                {
                    foreach (var header in test.Headers)
                    {
                        client.DefaultRequestHeaders.Add(header.Key, header.Value);
                    }

                    foreach (var assertion in test.Assertions)
                    {
                        var task = MakeRequest(client, test, assertion);
                        tasks.Add(task);
                    }
                    responses.AddRange(await Task.WhenAll(tasks));
                }

                var results = new TestResult();
                results.Id = test.Id + "-" + m_executionId;
                for (int i = 0; i < responses.Count; i++)
                {
                    var response = responses[i];
                    var assertion = test.Assertions[i];
                    var unitResult = new UnitResult();
                    unitResult.Request = assertion.Request;

                    if (!response.IsSuccessStatusCode)
                    {
                        unitResult.Error = response.ReasonPhrase;
                        unitResult.Rank = -1;
                        results.Results.Add(unitResult);
                        continue;
                    }

                    var content = await response.Content.ReadAsStringAsync();
                    Console.WriteLine("content" + content);
                    var jsonSource = JObject.Parse(content);
                    Console.WriteLine("query" + test.CorrectnessFieldQuery);
                    var searchResults = jsonSource.SelectTokens(test.CorrectnessFieldQuery).Select(x => x);
                    Console.WriteLine("Tokens Found: " + string.Join(",", searchResults));
                    var rank = searchResults.IndexOf(JToken.FromObject(assertion.Returns));
                    Console.WriteLine($"IndexOf '{assertion.Returns}' reported at '{rank}'");
                    unitResult.Rank = rank + 1;
                    results.Results.Add(unitResult);
                }
                results.MeanReciprocolRank = CalculateMRR(results);
                return results;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw;
            }
        }

        private float CalculateMRR(TestResult results)
        {
            var arr = 0f;
            foreach (var result in results.Results)
            {
                Console.WriteLine("Rank " + result.Rank);
                if (result.Rank < 1)
                {
                    continue;
                }
                arr += (1f / result.Rank);
            }
            Console.WriteLine("ARR " + arr);
            return arr / results.Results.Count;
        }

        private async Task<HttpResponseMessage> MakeRequest(HttpClient client, Test test, Assertion assertion)
        {
            var request = test.RequestFormat.Replace("{{query_string}}", assertion.Request);
            var content = new StringContent(request, System.Text.Encoding.UTF8, "application/json");
            return await client.PostAsync(test.Endpoint, content);
        }

        private async Task SaveResults(TestResult result)
        {
            using (var context = new DynamoDBContext(m_dynamo))
            {
                var config = new DynamoDBOperationConfig();
                config.OverrideTableName = m_testResultsTableName;
                await context.SaveAsync(result, config);
            }
        }

    }
}
