aws apigateway get-export \
--rest-api-id 2m4ncx4jdf  \
--stage-name prod \
--export-type swagger cdk/orders-swagger.json \
--parameters extensions='apigateway'