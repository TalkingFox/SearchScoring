resource "aws_api_gateway_resource" "tests" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  parent_id   = "${aws_api_gateway_resource.v1.id}"
  path_part   = "tests"
}

resource "aws_api_gateway_method" "get_tests" {
  rest_api_id   = "${aws_api_gateway_rest_api.api.id}"
  resource_id   = "${aws_api_gateway_resource.tests.id}"
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get_tests" {
  rest_api_id             = "${aws_api_gateway_rest_api.api.id}"
  resource_id             = "${aws_api_gateway_resource.tests.id}"
  http_method             = "${aws_api_gateway_method.get_tests.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${var.api_lambda_invoke_arn}"
}

resource "aws_api_gateway_method" "post_tests" {
  rest_api_id   = "${aws_api_gateway_rest_api.api.id}"
  resource_id   = "${aws_api_gateway_resource.tests.id}"
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "post_tests" {
  rest_api_id             = "${aws_api_gateway_rest_api.api.id}"
  resource_id             = "${aws_api_gateway_resource.tests.id}"
  http_method             = "${aws_api_gateway_method.get_tests.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${var.api_lambda_invoke_arn}"
}

resource "aws_api_gateway_resource" "test" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  parent_id   = "${aws_api_gateway_resource.tests.id}"
  path_part   = "{id}"
}

resource "aws_api_gateway_method" "get_test" {
  rest_api_id   = "${aws_api_gateway_rest_api.api.id}"
  resource_id   = "${aws_api_gateway_resource.test.id}"
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get_test" {
  rest_api_id             = "${aws_api_gateway_rest_api.api.id}"
  resource_id             = "${aws_api_gateway_resource.test.id}"
  http_method             = "${aws_api_gateway_method.get_test.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${var.api_lambda_invoke_arn}"
}
