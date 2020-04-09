data "aws_region" "current_region" {}

# https://github.com/terraform-providers/terraform-provider-aws/issues/162#issuecomment-532593939
locals {
  api_gateway_deployment_trigger_hash = "${sha1(join(",",
    list(
      jsonencode(aws_api_gateway_resource.tests),
      jsonencode(aws_api_gateway_method.get_tests),
      jsonencode(aws_api_gateway_method.post_tests),
      jsonencode(aws_api_gateway_resource.test),
      jsonencode(aws_api_gateway_method.get_test),
      jsonencode(aws_api_gateway_resource.test_results),
      jsonencode(aws_api_gateway_method.get_test_results),
      jsonencode(aws_api_gateway_method.execute),
    )
  ))}"
}

resource "aws_api_gateway_rest_api" "api" {
  name        = "scoring-api"
  description = "Api Gateway for Wyleconsesone Scoring"
  binary_media_types = [
    "*/*"
  ]
}

resource "aws_api_gateway_resource" "api" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  parent_id   = "${aws_api_gateway_rest_api.api.root_resource_id}"
  path_part   = "api"
}

resource "aws_api_gateway_resource" "v1" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  parent_id   = "${aws_api_gateway_resource.api.id}"
  path_part   = "v1"
}

resource "aws_api_gateway_stage" "deploy" {
  rest_api_id   = "${aws_api_gateway_rest_api.api.id}"
  stage_name    = "deploy"
  deployment_id = "${aws_api_gateway_deployment.deploy.id}"
}

resource "aws_api_gateway_deployment" "deploy" {
  depends_on = [
    "aws_api_gateway_integration.execute",
    "aws_api_gateway_integration.get_test",
    "aws_api_gateway_integration.get_tests",
    "aws_api_gateway_integration.post_tests",
    "aws_api_gateway_integration.get_test_results",
    "aws_api_gateway_integration.execute",
  ]

  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  stage_name  = "deploy"

  variables = {
    deploy_hash = "Scoring API. Deployment hash: ${local.api_gateway_deployment_trigger_hash}"
  }
  description = "Scoring API. Deployment hash: ${local.api_gateway_deployment_trigger_hash}"
}
