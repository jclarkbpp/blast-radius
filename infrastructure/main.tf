terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }
}

variable "cloudflare_account_id" {
  description = "Cloudflare Account ID"
  type        = string
}

provider "cloudflare" {}

resource "cloudflare_pages_project" "blast_radius" {
  account_id        = var.cloudflare_account_id
  name              = "blast-radius-practice"
  production_branch = "main"
}