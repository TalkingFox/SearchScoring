locals {
  resource_prefix = "scoring_${terraform.workspace}"
}

module "app" {
  source      = "./app"
  bucket_name = "${local.bucket_name}"
}

module "processor" {
  source                  = "./processor"
  resource_prefix         = "${local.resource_prefix}"
  test_table_name         = "${aws_dynamodb_table.Tests.id}"
  test_table_arn          = "${aws_dynamodb_table.Tests.arn}"
  test_results_table_name = "${aws_dynamodb_table.TestResults.id}"
  test_results_table_arn  = "${aws_dynamodb_table.TestResults.arn}"
  lambda_package_path     = "./processor.zip"
}


module "api" {
  source                  = "./api"
  resource_prefix         = "${local.resource_prefix}"
  tests_table_name        = "${aws_dynamodb_table.Tests.id}"
  tests_table_arn         = "${aws_dynamodb_table.Tests.arn}"
  test_results_table_name = "${aws_dynamodb_table.TestResults.id}"
  test_results_table_arn = "${aws_dynamodb_table.TestResults.arn}"
  api_lambda_package_path = "./api.zip"
  state_machine_arn       = "${module.processor.state_machine_arn}"
  state_machine_name      = "${module.processor.state_machine_name}"
}


module "access_point" {
  source                         = "./access_point"
  s3_bucket_domain_name          = "${module.app.s3_bucket_domain_name}"
  s3_bucket_origin_identity_path = "${module.app.s3_bucket_origin_identity_path}"
  api_invoke_url                 = "${module.api.api_invoke_url}"
  api_invoke_stage               = "${module.api.api_invoke_stage}"
  record_name                    = "${local.record_name}"
  hosted_zone                    = "${local.hosted_zone}"

}
