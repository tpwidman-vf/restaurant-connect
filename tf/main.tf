terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "3.35.0"
    }
  }
  backend "s3" {
    bucket  = "vf-restaurant-connect-terraform-state"
    key     = "restaurant-connect"
    encrypt = "true"
  }
}
provider "aws" {
  # Configuration options
}
