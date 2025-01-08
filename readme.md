# Search Scoring

A proof-of-concept for evaluating the effectiveness of a arbitary search engine. Test consists of a pairs of search request keyword and expected top result. Test is executed and a Mean Recipricol Rank score is calculated from the results. 

# Components
## App
Typescript app for executing search tests and viewing results.

## Processor
AWS Lambda function that makes the requests specified in the test, records the results, calculates the MRR, and saves the results into a DynamoDB table.

## API
AWS API Gateway and Lambda function that allow the App to interface with the Processor component. Supports Test CRUD operations as well as Test executoin endpoints.