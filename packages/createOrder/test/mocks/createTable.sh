aws dynamodb create-table \
    --endpoint-url=http://localhost:4566 \
    --table-name Orders \
    --attribute-definitions AttributeName=orderId,AttributeType=S AttributeName=createdAt,AttributeType=N \
    --key-schema AttributeName=orderId,KeyType=HASH  AttributeName=createdAt,KeyType=RANGE \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --region us-east-1