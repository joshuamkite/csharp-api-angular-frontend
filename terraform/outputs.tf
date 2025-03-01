# Outputs
output "github_oidc_provider_arn" {
  value       = aws_iam_openid_connect_provider.github_actions.arn
  description = "GitHub OIDC Provider ARN"
}

output "github_actions_role_arn" {
  value       = aws_iam_role.github_actions_ecr.arn
  description = "GitHub Actions Role ARN to use in workflow"
}

output "ecr_repository_urls" {
  value       = { for name, repo in aws_ecrpublic_repository.repositories : name => repo.repository_uri }
  description = "ECR Public Repository URLs"
}

output "ecr_registry_alias" {
  value       = split("/", values(aws_ecrpublic_repository.repositories)[0].repository_uri)[1]
  description = "ECR Public Registry Alias"
}
