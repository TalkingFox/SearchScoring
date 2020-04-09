data "aws_caller_identity" "current" {}


module "api_gateway" {
  source                = "./api_gateway"
  api_lambda_invoke_arn = "${aws_lambda_function.lambda.invoke_arn}"
}
