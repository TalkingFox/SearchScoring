using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.DynamoDBv2;
using Microsoft.Extensions.Configuration;
using Amazon.DynamoDBv2.DataModel;
using Newtonsoft.Json;
using Amazon.StepFunctions;
using Amazon.StepFunctions.Model;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]

namespace api
{
    public class Function
    {

        private readonly IAmazonStepFunctions m_stepFunctions;
        private readonly IAmazonDynamoDB m_dynamo;
        private readonly string m_testsTableName;
        private readonly string mTestResultsTableName;
        private readonly string StateMachineArn;
        public Function()
        {
            var builder = new ConfigurationBuilder();
            builder.AddEnvironmentVariables();
            var config = builder.Build();

            m_testsTableName = config.GetValue<string>("tests_table_name");
            mTestResultsTableName = config.GetValue<string>("test_results_table_name");
            StateMachineArn = config.GetValue<string>("state_machine_arn");
            m_dynamo = new AmazonDynamoDBClient();
            m_stepFunctions = new AmazonStepFunctionsClient();
        }

        /// <summary>
        /// A simple function that takes a string and does a ToUpper
        /// </summary>
        /// <param name="input"></param>
        /// <param name="context"></param>
        /// <returns></returns>
        public async Task<APIGatewayProxyResponse> FunctionHandler(APIGatewayProxyRequest request, ILambdaContext context)
        {
            string requestBody = request.Body;
            if (request.IsBase64Encoded)
            {
                var bytes = Convert.FromBase64String(request.Body);
                requestBody = System.Text.Encoding.UTF8.GetString(bytes);
            }
            switch (request.Path)
            {
                case "/api/v1/tests":
                    if (request.HttpMethod == "GET")
                    {
                        var tests = await GetAllTests();
                        return CreateResponse(200, tests);
                    }
                    if (request.HttpMethod == "POST")
                    {
                        var test = JsonConvert.DeserializeObject<Test>(requestBody);
                        if (!test.RequestFormat.Contains("{{query_string}"))
                        {
                            return CreateResponse(400, "RequestFormat property must contain {{query_string}} in order for subsitution to occur.");
                        }
                        await SaveTest(test);
                        return CreateResponse(204);
                    }
                    return CreateResponse(415);
                case var x when x.StartsWith("/api/v1/execute"):
                    var id = System.Web.HttpUtility.UrlDecode(request.PathParameters["id"]);
                    if (request.HttpMethod == "GET")
                    {
                        var status = await GetTestStatus(id);
                        return CreateResponse(200, status);
                    }
                    if (request.HttpMethod == "POST")
                    {
                        if (!await IsTestExisting(id))
                        {
                            return CreateResponse(400, $"Test {id} does not exist!");
                        }
                        var jobId = await StartTest(id);
                        return CreateResponse(200, jobId);
                    }
                    return CreateResponse(415);
                default:
                    return CreateResponse(415);
            }
        }

        private async Task<IEnumerable<Test>> GetAllTests()
        {
            using (var context = new DynamoDBContext(m_dynamo))
            {
                var conditions = new List<ScanCondition>();
                var config = new DynamoDBOperationConfig();
                config.OverrideTableName = m_testsTableName;

                var job = context.ScanAsync<Test>(conditions, config);
                var results = await job.GetRemainingAsync();
                return results;
            }
        }

        private async Task SaveTest(Test test)
        {
            using (var context = new DynamoDBContext(m_dynamo))
            {
                var config = new DynamoDBOperationConfig();
                config.OverrideTableName = m_testsTableName;
                await context.SaveAsync(test, config);
            }
        }

        private async Task<string> StartTest(string testId)
        {
            var executionName = "TestId-" + Guid.NewGuid().ToString();
            var request = new StartExecutionRequest();
            request.Input = JsonConvert.SerializeObject(new { TestId = testId });
            request.Name = executionName;
            request.StateMachineArn = StateMachineArn;

            var response = await m_stepFunctions.StartExecutionAsync(request);
            return response.ExecutionArn;
        }

        private async Task<ExecutionStatus> GetTestStatus(string executionArn)
        {
            var request = new DescribeExecutionRequest();
            request.ExecutionArn = executionArn;
            var response = await m_stepFunctions.DescribeExecutionAsync(request);
            return response.Status;
        }

        private async Task<bool> IsTestExisting(string testId)
        {
            using (var context = new DynamoDBContext(m_dynamo))
            {
                var config = new DynamoDBOperationConfig();
                config.OverrideTableName = m_testsTableName;
                var result = await context.LoadAsync<Test>(testId, config);
                return result != null;
            }
        }

        private APIGatewayProxyResponse CreateResponse(int statusCode, object body = null)
        {
            var bodyAsSerial = (body == null) ? "" : JsonConvert.SerializeObject(body);
            return new APIGatewayProxyResponse
            {
                Body = bodyAsSerial,
                StatusCode = statusCode
            };
        }
    }
}
