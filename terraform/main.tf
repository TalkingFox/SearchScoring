locals {
  resource_prefix = "scoring_${terraform.workspace}"
}

module "app" {
  source      = "./app"
  bucket_name = "${local.bucket_name}"
}

module "api" {
  source                  = "./api"
  resource_prefix         = "${local.resource_prefix}"
  scoring_table_name      = "${aws_dynamodb_table.ScoringTests.name}"
  scoring_table_arn       = "${aws_dynamodb_table.ScoringTests.arn}"
  api_lambda_package_path = "./api.zip"
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
