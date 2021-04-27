resource "aws_glue_catalog_database" "orders" {
  name = "orders_glue_database"
}
resource "aws_glue_catalog_table" "orders_table" {
  name          = "orders_table"
  database_name = aws_glue_catalog_database.orders.name
}