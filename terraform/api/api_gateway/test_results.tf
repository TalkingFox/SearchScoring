resource "aws_api_gateway_resource" "test_results" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  parent_id   = "${aws_api_gateway_resource.test.id}"
  path_part   = "results"
}
resource "aws_api_gateway_method" "get_test_results" {
  rest_api_id   = "${aws_api_gateway_rest_api.api.id}"
  resource_id   = "${aws_api_gateway_resource.test_results.id}"
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get_test_results" {
  rest_api_id             = "${aws_api_gateway_rest_api.api.id}"
  resource_id             = "${aws_api_gateway_resource.test_results.id}"
  http_method             = "${aws_api_gateway_method.get_test_results.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${var.api_lambda_invoke_arn}"
}
