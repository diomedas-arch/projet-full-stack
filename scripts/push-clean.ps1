param(
    [Parameter(Mandatory = $true)]
    [string]$RepositoryUrl,

    [string]$Branch = "main",

    [string]$CommitMessage = "Initial commit"
)

$ErrorActionPreference = "Stop"

function Assert-CommandExists {
    param([string]$CommandName)

    if (-not (Get-Command $CommandName -ErrorAction SilentlyContinue)) {
        throw "La commande '$CommandName' est introuvable. Installe Git puis relance ce script."
    }
}

Assert-CommandExists "git"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $projectRoot

Write-Host "Projet : $projectRoot"

if (Test-Path -LiteralPath ".git") {
    $gitHead = Join-Path ".git" "HEAD"
    $gitConfig = Join-Path ".git" "config"

    if ((Test-Path -LiteralPath $gitHead) -and (Test-Path -LiteralPath $gitConfig)) {
        Write-Host "Depot Git local deja initialise."
    } else {
        $backupName = ".git_backup_" + (Get-Date -Format "yyyyMMdd_HHmmss")
        Write-Host "Ancien dossier .git incomplet detecte. Renommage en $backupName"
        Rename-Item -LiteralPath ".git" -NewName $backupName
    }
}

if (-not (Test-Path -LiteralPath ".git")) {
    git init
}

git branch -M $Branch

$existingOrigin = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0) {
    git remote set-url origin $RepositoryUrl
} else {
    git remote add origin $RepositoryUrl
}

git add .

$status = git status --porcelain
if (-not $status) {
    Write-Host "Aucun changement a commiter."
} else {
    git commit -m $CommitMessage
}

git push -u origin $Branch

Write-Host "Push termine vers $RepositoryUrl"
