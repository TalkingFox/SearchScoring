resource "aws_sfn_state_machine" "processor" {
  name     = "${var.resource_prefix}_processor"
  role_arn = "${aws_iam_role.role_for_stepfunction.arn}"
  tags {
    Name      = "${var.product}_publish_product_${terraform.workspace}"
    Dept      = "engineering"
    Team      = "fortknights"
    LifeCycle = "${var.lifecycle_environment}"
    Product   = "${var.product}_publish_product"
  }
  depends_on = ["aws_iam_role.assume"]
  definition = <<EOF
{  
  "StartAt": "ExecuteTest",
  "States": {
    "ExecuteTest": {
      "Type": "Task",
      "Resource": "${aws_lambda_function.lambda.function_arn}",
      "End": true
    }
  }
}
EOF
}
resource "aws_iam_role" "assume" {
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
  role   = "${aws_iam_role.assume.id}"
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
