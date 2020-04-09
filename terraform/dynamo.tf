# id: 'Test Title'
# request_format: '{ "search_string": "{{query_string}}"}'
# https://www.newtonsoft.com/json/help/html/QueryJsonSelectTokenJsonPath.htm
# correctness_field_query: '$.hits.hits.._source.code'
# Assertions: [{"request": 'tacos', "returns": "12345"}]

resource "aws_dynamodb_table" "ScoringTests" {
  name         = "${local.resource_prefix}_scoring_tests"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  attribute {
    name = "id"
    type = "S"
  }
}

# id: '{0000-0000-00000000-0000000'
# test: {id:'Test Title', request_format....}
# MRR: 0.5
# Results: [{"request": 'tacos', "returns": "12345", "rank": 1}]

resource "aws_dynamodb_table" "ScoringTestResults" {
  name         = "${local.resource_prefix}_scoring_test_results"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  attribute {
    name = "id"
    type = "S"
  }
}

