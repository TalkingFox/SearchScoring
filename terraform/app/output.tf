output "s3_bucket_origin_identity_path" {
  value = "${aws_cloudfront_origin_access_identity.scoring_identity.cloudfront_access_identity_path}"
}

output "s3_bucket_name" {
  value = "${aws_s3_bucket.bucket.id}"
}

output "s3_bucket_domain_name" {
  value = "${aws_s3_bucket.bucket.bucket_regional_domain_name}"
}

output "s3_bucket_arn" {
  value = "${aws_s3_bucket.bucket.arn}"
}

