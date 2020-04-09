$ErrorActionPreference = "Stop"

npm run build-prod
$bucket = 's3://wyleconsesone-scoring'
aws s3 cp "index.html" "$bucket/index.html"
aws s3 cp "site.css" "$bucket/site.css"
aws s3 sync "dist" "$bucket/dist/"
aws cloudfront create-invalidation --distribution-id E3SCM8INPCH9RX --paths "/index.html" "/site.css" "/dist/*"