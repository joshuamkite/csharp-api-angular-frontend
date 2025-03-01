
terraform {
  backend "s3" {
    bucket  = var.s3_backend_config["bucket"]
    key     = var.s3_backend_config["key"]
    region  = var.s3_backend_config["region"]
    encrypt = var.s3_backend_config["encrypt"]
  }
}
