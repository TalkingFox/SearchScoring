resource "aws_api_gateway_resource" "execute" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  parent_id   = "${aws_api_gateway_resource.v1.id}"
  path_part   = "execute"
}

resource "aws_api_gateway_resource" "execute_id" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  parent_id   = "${aws_api_gateway_resource.execute.id}"
  path_part   = "{id}"
}

resource "aws_api_gateway_method" "post_execute_id" {
  rest_api_id   = "${aws_api_gateway_rest_api.api.id}"
  resource_id   = "${aws_api_gateway_resource.execute_id.id}"
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "post_execute_id" {
  rest_api_id             = "${aws_api_gateway_rest_api.api.id}"
  resource_id             = "${aws_api_gateway_resource.execute_id.id}"
  http_method             = "${aws_api_gateway_method.post_execute_id.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${var.api_lambda_invoke_arn}"
}

resource "aws_api_gateway_method" "get_execute_id" {
  rest_api_id   = "${aws_api_gateway_rest_api.api.id}"
  resource_id   = "${aws_api_gateway_resource.execute_id.id}"
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get_execute_id" {
  rest_api_id             = "${aws_api_gateway_rest_api.api.id}"
  resource_id             = "${aws_api_gateway_resource.execute_id.id}"
  http_method             = "${aws_api_gateway_method.get_execute_id.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${var.api_lambda_invoke_arn}"
}
