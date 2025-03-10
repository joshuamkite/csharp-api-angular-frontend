variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
}

variable "default_tags" {
  description = "Default tags to apply to all resources"
  type        = map(string)
  default     = {}
}

variable "ecr_repositories" {
  description = "List of ECR repository names to create"
  type        = list(string)
  default     = ["loan-management-api", "loan-management-frontend"]
}

variable "github_repo" {
  description = "GitHub repository (format: username/repo-name)"
  type        = string
}

variable "domain_name" {
  description = "Domain name for Route53 hosted zone (e.g., example.com)"
  type        = string
}

variable "ecr_subdomain" {
  description = "Subdomain for ECR repositories (e.g., docker-images)"
  type        = string
}



variable "s3_backend_config" {
  description = "Configuration for the S3 backend"
  type = object({
    bucket  = string
    key     = string
    region  = string
    encrypt = bool
  })
}
