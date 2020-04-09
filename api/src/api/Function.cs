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

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]

namespace api
{
    public class Function
    {

        private readonly IAmazonDynamoDB m_dynamo;
        private readonly IConfiguration m_configuration;
        private readonly string TestsTableName;
        private readonly string TestsResultsTableName;
        private readonly string StateMachineArn;
        public Function()
        {
            var builder = new ConfigurationBuilder();
            builder.AddEnvironmentVariables();

            m_configuration = builder.Build();
            TestsTableName = m_configuration.GetValue<string>("tests_table_name");
            TestsResultsTableName = m_configuration.GetValue<string>("test_results_table_name");
            TestsResultsTableName = m_configuration.GetValue<string>("state_machine_arn");
            m_dynamo = new AmazonDynamoDBClient();
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
                var bytes =  Convert.FromBase64String(request.Body);
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
                        await SaveTest(test);
                        return CreateResponse(204);
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
                config.OverrideTableName = TestsTableName;

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
                config.OverrideTableName = TestsTableName;
                await context.SaveAsync(test, config);
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
