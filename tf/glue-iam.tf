data "aws_iam_policy" "aws_managed_glue" {
  arn = "arn:aws:iam::aws:policy/service-role/AWSGlueServiceRole"
}

resource "aws_iam_policy" "glue" {
  name        = "glue_policy"
  description = "Grant Glue access to describe and scan the Orders table."
  policy      = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:DescribeTable",
                "dynamodb:Scan"
            ],
            "Resource": [
                "arn:aws:dynamodb:us-east-1:252608137475:table/Orders*"
            ]
        }
    ]
}
EOF
}

resource "aws_iam_role" "glue" {
  name               = "glue_role"
  assume_role_policy = <<EOF
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Action": "sts:AssumeRole",
			"Principal": {"Service": "glue.amazonaws.com"},
			"Effect": "Allow"
		}
	]
}
EOF
}

resource "aws_iam_policy_attachment" "aws_managed_glue" {
  name = "glue_attach_managed"
  roles = [aws_iam_role.glue.id]
  policy_arn = data.aws_iam_policy.aws_managed_glue.arn
}

resource "aws_iam_policy_attachment" "glue" {
  name       = "glue_attach_policy"
  roles      = [aws_iam_role.glue.id]
  policy_arn = aws_iam_policy.glue.arn
}
