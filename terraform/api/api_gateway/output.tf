output "rest_api_id" {
  value = "${aws_api_gateway_rest_api.api.id}"
}

output "api_invoke_url" {
  value = "${aws_api_gateway_rest_api.api.id}.execute-api.us-east-1.amazonaws.com"
}

output "api_invoke_stage" {
  value = "${aws_api_gateway_deployment.deploy.stage_name}"
}
