# build-dist.ps1 — gera pasta dist/ enxuta para deploy no Cloudflare Pages
# Uso:  .\build-dist.ps1
# Requer: PowerShell 5+, espaco em disco para ~35MB
param([switch]$Force)

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$dist = Join-Path $root "dist"

if (Test-Path $dist) {
    Write-Host "[build-dist] Limpando dist/ existente..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $dist
}
New-Item -ItemType Directory -Path $dist | Out-Null

# 1) HTML pages (apenas as 7 reais)
$htmlFiles = @(
    "index.html",
    "redes.html",
    "rotas.html",
    "orcamento.html",
    "mudanca-residencial.html",
    "mudanca-comercial.html",
    "mudanca-interestadual.html",
    "fretes-cargas.html",
    "embalagem-montagem.html"
)
Write-Host "[build-dist] Copiando HTMLs..."
foreach ($f in $htmlFiles) {
    if (Test-Path (Join-Path $root $f)) {
        Copy-Item (Join-Path $root $f) $dist
    } else {
        Write-Host "  [skip] $f nao encontrado" -ForegroundColor DarkYellow
    }
}

# 2) CSS ativos
$cssFiles = @(
    "site.css",
    "detalhes.css",
    "bluemore.css",
    "modelo.css",
    "motion.css",
    "pages.css",
    "forms.css"
)
Write-Host "[build-dist] Copiando CSS..."
foreach ($f in $cssFiles) {
    Copy-Item (Join-Path $root $f) $dist
}

# 3) JS ativos
$jsFiles = @(
    "app.js",
    "motion.js",
    "reviews.js",
    "gsap-init.js"
)
Write-Host "[build-dist] Copiando JS..."
foreach ($f in $jsFiles) {
    Copy-Item (Join-Path $root $f) $dist
}

# 4) data/ (reputation.js + reviews.json)
Write-Host "[build-dist] Copiando data/..."
$dataDist = Join-Path $dist "data"
New-Item -ItemType Directory -Path $dataDist | Out-Null
Copy-Item (Join-Path $root "data\reputation.js") $dataDist
Copy-Item (Join-Path $root "data\reviews.json") $dataDist

# 5) assets/ publicos
Write-Host "[build-dist] Copiando assets/ publicos (~33MB)..."
$assetExtensions = @(".avif", ".gif", ".ico", ".jpeg", ".jpg", ".png", ".svg", ".webp")
$assetsRoot = Join-Path $root "assets"
$assetsDist = Join-Path $dist "assets"
Get-ChildItem -Recurse -File $assetsRoot | Where-Object { $assetExtensions -contains $_.Extension.ToLowerInvariant() } | ForEach-Object {
    $relative = $_.FullName.Substring($assetsRoot.Length).TrimStart("\", "/")
    $target = Join-Path $assetsDist $relative
    $targetDir = Split-Path $target -Parent
    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir | Out-Null
    }
    Copy-Item $_.FullName $target
}

# 6) robots.txt + sitemap.xml
foreach ($f in @("robots.txt", "sitemap.xml")) {
    if (Test-Path (Join-Path $root $f)) {
        Copy-Item (Join-Path $root $f) $dist
    }
}

# Resumo
$size = (Get-ChildItem -Recurse $dist | Measure-Object -Property Length -Sum).Sum / 1MB
$count = (Get-ChildItem -Recurse $dist -File).Count
Write-Host ""
Write-Host "[build-dist] PRONTO" -ForegroundColor Green
Write-Host "  Pasta:    $dist"
Write-Host ("  Tamanho:  {0:N2} MB" -f $size)
Write-Host "  Arquivos: $count"
Write-Host ""
Write-Host "Proximo passo:"
Write-Host "  Drag-drop:  abra https://dash.cloudflare.com -> Workers and Pages -> Create -> Pages -> Direct upload"
Write-Host "  Wrangler:   npx wrangler@latest pages deploy dist --project-name=asi-pageforce-site"
