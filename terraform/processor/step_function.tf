resource "aws_sfn_state_machine" "processor" {
  name       = "${var.resource_prefix}_processor"
  role_arn   = "${aws_iam_role.step_function.arn}"
  depends_on = ["aws_iam_role.step_function"]
  definition = <<EOF
{  
  "StartAt": "ExecuteTest",
  "States": {
    "ExecuteTest": {
      "Type": "Task",
      "Parameters": {
          "executionId.$": "$$.Execution.Id",
          "testId.$": "$.TestId"
      },
      "Resource": "${aws_lambda_function.lambda.arn}",
      "End": true
    }
  }
}
EOF
}
resource "aws_iam_role" "step_function" {
  name = "${var.resource_prefix}_processor_assume"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "states.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}
resource "aws_iam_role_policy" "invoke" {
  name   = "${var.resource_prefix}_processor_invoke"
  role   = "${aws_iam_role.step_function.id}"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "lambda:InvokeFunction",
      "Effect": "Allow",
      "Resource": "${aws_lambda_function.lambda.arn}"
    }
  ]
}
EOF
}
