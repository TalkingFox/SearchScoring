resource "aws_iam_role" "lambda_role" {
  name               = "${var.resource_prefix}_api"
  assume_role_policy = "${data.aws_iam_policy_document.lambda.json}"
}

data "aws_iam_policy_document" "lambda" {
  statement {
    sid = "processor"
    actions = [
      "sts:AssumeRole"
    ]
    principals {
      type = "Service"
      identifiers = [
        "lambda.amazonaws.com"
      ]
    }
    effect = "Allow"
  }
}

data "aws_iam_policy_document" "permission" {
  statement {
    sid = "logging"
    actions = [
      "autoscaling:Describe*",
      "cloudwatch:*",
      "logs:*",
      "sns:*",
      "iam:GetPolicy",
      "iam:GetPolicyVersion",
      "iam:GetRole",
    ]

    effect    = "Allow"
    resources = ["*"]
  }

  statement {
    sid = "testTableAccess"
    actions = [
      "dynamodb:DescribeTable",
      "dynamodb:GetItem",
      "dynamodb:Scan",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem"
    ]
    effect = "Allow"
    resources = [
      "${var.tests_table_arn}"
    ]
  }

  statement {
    sid = "testResultsTableAccess"
    actions = [
      "dynamodb:DescribeTable",
      "dynamodb:GetItem",
      "dynamodb:Scan"
    ]
    effect = "Allow"
    resources = [
      "${var.test_results_table_arn}"
    ]
  }

  statement {
    sid = "stateMachineAccess"
    actions = [
      "states:StartExecution",
      "states:DescribeExecution"
    ]
    effect = "Allow"
    resources = [
      "${var.state_machine_arn}",
      "arn:aws:states:*:*:execution:${var.state_machine_name}:*"
    ]
  }
}

resource "aws_iam_role_policy_attachment" "permission" {
  role       = "${aws_iam_role.lambda_role.name}"
  policy_arn = "${aws_iam_policy.permission.arn}"
}

resource "aws_iam_policy" "permission" {
  name   = "${var.resource_prefix}_api"
  policy = "${data.aws_iam_policy_document.permission.json}"
}


resource "aws_lambda_function" "lambda" {
  filename         = "${var.api_lambda_package_path}"
  function_name    = "${var.resource_prefix}_api"
  role             = "${aws_iam_role.lambda_role.arn}"
  handler          = "api::api.Function::FunctionHandler"
  publish          = true
  runtime          = "dotnetcore2.1"
  source_code_hash = "${filebase64sha256(var.api_lambda_package_path)}"
  timeout          = 30
  environment {
    variables = {
      tests_table_name        = "${var.tests_table_name}"
      test_results_table_name = "${var.test_results_table_name}"
      state_machine_arn       = "${var.state_machine_arn}"
    }
  }
}

resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.lambda.function_name}"
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
  source_arn = "arn:aws:execute-api:us-east-1:${data.aws_caller_identity.current.account_id}:${module.api_gateway.rest_api_id}/*/*/*"
}
