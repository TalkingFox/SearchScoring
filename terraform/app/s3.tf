resource "aws_s3_bucket" "bucket" {
  bucket = "${var.bucket_name}"
  acl    = "private"
  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_public_access_block" "bucket" {
  bucket                  = "${aws_s3_bucket.bucket.id}"
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_policy" "terraform_access" {
  bucket = "${aws_s3_bucket.bucket.id}"
  policy = "${data.aws_iam_policy_document.terraform_access.json}"
}

data "aws_iam_policy_document" "terraform_access" {
  statement {
    sid = "terraform_access"
    actions = [
      "s3:*"
    ]
    effect = "Allow"
    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::031715454210:user/Terraform"]
    }
    resources = [
      "${aws_s3_bucket.bucket.arn}",
      "${aws_s3_bucket.bucket.arn}/*"
    ]
  }

  statement {
    sid = "music_origin_identity_access"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:PutObjectTagging"
    ]
    effect = "Allow"
    principals {
      type        = "AWS"
      identifiers = ["${aws_cloudfront_origin_access_identity.music_identity.iam_arn}"]
    }
    resources = [
      "${aws_s3_bucket.bucket.arn}",
      "${aws_s3_bucket.bucket.arn}/*"
    ]
  }
}

resource "aws_cloudfront_origin_access_identity" "scoring_identity" {
  comment = "Allow scoring cloudfront distribution access to S3 bucket"
}
