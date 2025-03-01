
# OIDC Provider for GitHub Actions
resource "aws_iam_openid_connect_provider" "github_actions" {
  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
  thumbprint_list = [
    "6938fd4d98bab03faadb97b34396831e3780aea1", # GitHub Actions OIDC Provider thumbprint
    "1c58a3a8518e8759bf075b76b750d4f2df264fcd"  # Additional thumbprint for rotation
  ]

  tags = {
    Name = "github-actions-oidc-provider"
  }
}

# Trust policy for GitHub Actions OIDC
data "aws_iam_policy_document" "github_actions_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github_actions.arn]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.github_repo}:*"]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
  }
}

# IAM Role for GitHub Actions
resource "aws_iam_role" "github_actions_ecr" {
  name               = "GitHubActionsECRRole"
  assume_role_policy = data.aws_iam_policy_document.github_actions_assume_role.json
}

# ECR Public Repositories
resource "aws_ecrpublic_repository" "repositories" {
  for_each = toset(var.ecr_repositories)
  provider = aws.us_east_1

  repository_name = each.key

  catalog_data {
    description       = "${each.key} container repository"
    architectures     = ["x86-64"]
    operating_systems = ["Linux"]
  }

  tags = {
    Name = each.key
  }
}

# ECR Public Policy document for GitHub Actions access
data "aws_iam_policy_document" "ecr_access" {
  statement {
    effect = "Allow"
    actions = [
      "ecr-public:BatchCheckLayerAvailability",
      "ecr-public:CompleteLayerUpload",
      "ecr-public:InitiateLayerUpload",
      "ecr-public:PutImage",
      "ecr-public:UploadLayerPart",
      "ecr-public:DescribeImages",
      "ecr-public:DescribeRepositories",
      "ecr-public:ListImages",
      "ecr-public:GetRepositoryCatalogData",
      "ecr-public:GetRepositoryPolicy"
    ]
    resources = [for repo in aws_ecrpublic_repository.repositories : repo.arn]
  }

  statement {
    effect    = "Allow"
    actions   = ["ecr-public:GetAuthorizationToken", "sts:GetServiceBearerToken"]
    resources = ["*"]
  }
}

# IAM Policy for ECR access
resource "aws_iam_policy" "ecr_access" {
  name        = "GitHubActionsECRAccess"
  description = "Policy to allow GitHub Actions to push images to ECR Public"
  policy      = data.aws_iam_policy_document.ecr_access.json
}

# Attach the policy to the IAM role
resource "aws_iam_role_policy_attachment" "github_actions_ecr_policy" {
  role       = aws_iam_role.github_actions_ecr.name
  policy_arn = aws_iam_policy.ecr_access.arn
}
