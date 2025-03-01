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

  tags = {
    Name = "github-actions-ecr-role"
  }
}

# ECR Repositories
resource "aws_ecr_repository" "repositories" {
  for_each = toset(var.ecr_repositories)

  name                 = each.key
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = {
    Name = each.key
  }
}

# ECR Policy document for GitHub Actions access
data "aws_iam_policy_document" "ecr_access" {
  statement {
    effect = "Allow"
    actions = [
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchCheckLayerAvailability",
      "ecr:BatchGetImage",
      "ecr:BatchDeleteImage",
      "ecr:CompleteLayerUpload",
      "ecr:InitiateLayerUpload",
      "ecr:PutImage",
      "ecr:UploadLayerPart",
      "ecr:DescribeImages",
      "ecr:DescribeRepositories",
      "ecr:ListImages"
    ]
    resources = [for repo in aws_ecr_repository.repositories : repo.arn]
  }

  statement {
    effect    = "Allow"
    actions   = ["ecr:GetAuthorizationToken"]
    resources = ["*"]
  }
}

# IAM Policy for ECR access
resource "aws_iam_policy" "ecr_access" {
  name        = "GitHubActionsECRAccess"
  description = "Policy to allow GitHub Actions to push images to ECR"
  policy      = data.aws_iam_policy_document.ecr_access.json
}

# Attach the policy to the IAM role
resource "aws_iam_role_policy_attachment" "github_actions_ecr_policy" {
  role       = aws_iam_role.github_actions_ecr.name
  policy_arn = aws_iam_policy.ecr_access.arn
}

# Policy document for public access to ECR repositories
data "aws_iam_policy_document" "ecr_public_access" {
  statement {
    sid    = "AllowPublicPull"
    effect = "Allow"

    principals {
      type        = "*"
      identifiers = ["*"]
    }

    actions = [
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage",
      "ecr:BatchCheckLayerAvailability",
      "ecr:DescribeImages",
      "ecr:DescribeRepositories",
      "ecr:ListImages"
    ]
  }
}

# Apply public access policy to each repository
resource "aws_ecr_repository_policy" "public_access" {
  for_each = toset(var.ecr_repositories)

  repository = aws_ecr_repository.repositories[each.key].name
  policy     = data.aws_iam_policy_document.ecr_public_access.json
}
