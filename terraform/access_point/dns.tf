data "aws_route53_zone" "zone" {
  name = "${var.hosted_zone}"
}

resource "aws_route53_record" "scoring" {
  zone_id = "${data.aws_route53_zone.zone.zone_id}"
  name    = "${var.record_name}"
  type    = "CNAME"
  ttl     = "300"
  records = ["${aws_cloudfront_distribution.streaming.domain_name}"]
}

resource "aws_acm_certificate" "cert" {
  domain_name       = "${var.record_name}"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "cert_validation" {
  name    = "${aws_acm_certificate.cert.domain_validation_options.0.resource_record_name}"
  type    = "${aws_acm_certificate.cert.domain_validation_options.0.resource_record_type}"
  zone_id = "${data.aws_route53_zone.zone.id}"
  records = ["${aws_acm_certificate.cert.domain_validation_options.0.resource_record_value}"]
  ttl     = 60
}

resource "aws_acm_certificate_validation" "cert" {
  certificate_arn         = "${aws_acm_certificate.cert.arn}"
  validation_record_fqdns = ["${aws_route53_record.cert_validation.fqdn}"]
}
