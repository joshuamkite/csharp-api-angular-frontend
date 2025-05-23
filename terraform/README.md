# AWS ECR Public Gallery Terraform Module

This Terraform module sets up Amazon ECR Public Gallery repositories with GitHub Actions integration for CI/CD. It enables public access to container images without requiring authentication for pulls, while securing the push process with GitHub Actions OIDC.

## Features

- Creates Amazon ECR Public Gallery repositories
- Sets up GitHub Actions OIDC authentication
- Configures IAM roles and policies for secure pushing
- Outputs repository URLs and registry alias for GitHub Actions workflows

## Public Access

Images in ECR Public Gallery can be pulled without authentication:

```bash
docker pull public.ecr.aws/{registry-alias}/{repository-name}:latest
```

## Notes

- ECR Public Gallery is only available in the `us-east-1` region
- Authentication is still required for pushing images
- GitHub Actions OIDC is recommended for secure CI/CD workflows


## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | ~> 5.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | 5.89.0 |
| <a name="provider_aws.us_east_1"></a> [aws.us\_east\_1](#provider\_aws.us\_east\_1) | 5.89.0 |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [aws_ecrpublic_repository.repositories](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecrpublic_repository) | resource |
| [aws_iam_openid_connect_provider.github_actions](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_openid_connect_provider) | resource |
| [aws_iam_policy.ecr_access](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_role.github_actions_ecr](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.github_actions_ecr_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_policy_document.ecr_access](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.github_actions_assume_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_aws_region"></a> [aws\_region](#input\_aws\_region) | AWS region to deploy resources | `string` | n/a | yes |
| <a name="input_default_tags"></a> [default\_tags](#input\_default\_tags) | Default tags to apply to all resources | `map(string)` | `{}` | no |
| <a name="input_domain_name"></a> [domain\_name](#input\_domain\_name) | Domain name for Route53 hosted zone (e.g., example.com) | `string` | n/a | yes |
| <a name="input_ecr_repositories"></a> [ecr\_repositories](#input\_ecr\_repositories) | List of ECR repository names to create | `list(string)` | <pre>[<br/>  "loan-management-api",<br/>  "loan-management-frontend"<br/>]</pre> | no |
| <a name="input_ecr_subdomain"></a> [ecr\_subdomain](#input\_ecr\_subdomain) | Subdomain for ECR repositories (e.g., docker-images) | `string` | n/a | yes |
| <a name="input_github_repo"></a> [github\_repo](#input\_github\_repo) | GitHub repository (format: username/repo-name) | `string` | n/a | yes |
| <a name="input_s3_backend_config"></a> [s3\_backend\_config](#input\_s3\_backend\_config) | Configuration for the S3 backend | <pre>object({<br/>    bucket  = string<br/>    key     = string<br/>    region  = string<br/>    encrypt = bool<br/>  })</pre> | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_ecr_registry_alias"></a> [ecr\_registry\_alias](#output\_ecr\_registry\_alias) | ECR Public Registry Alias |
| <a name="output_ecr_repository_urls"></a> [ecr\_repository\_urls](#output\_ecr\_repository\_urls) | ECR Public Repository URLs |
| <a name="output_github_actions_role_arn"></a> [github\_actions\_role\_arn](#output\_github\_actions\_role\_arn) | GitHub Actions Role ARN to use in workflow |
| <a name="output_github_oidc_provider_arn"></a> [github\_oidc\_provider\_arn](#output\_github\_oidc\_provider\_arn) | GitHub OIDC Provider ARN |
