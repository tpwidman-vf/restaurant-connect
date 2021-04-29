aws --endpoint-url=http://localhost:4566 dynamodb create-table  \
--table-name Orders \
--attribute-definitions AttributeName=orderId,AttributeType=S \
--key-schema AttributeName=orderId,KeyType=HASH \
--provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

aws --endpoint-url=http://localhost:4566 dynamodb delete-table  \
--table-name Orders \