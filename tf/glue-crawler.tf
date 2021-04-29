resource "aws_glue_crawler" "orders" {
    depends_on = [
        aws_glue_catalog_database.orders,
        aws_iam_role.glue
    ]
    database_name = aws_glue_catalog_database.orders.name
    name          = "OrdersGlueCrawler"
    role          = aws_iam_role.glue.arn
    
    dynamodb_target {
        path = "Orders"
    }
}