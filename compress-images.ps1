# 이미지 압축 스크립트 (PowerShell + .NET)
# GitHub Issues 업로드를 위해 10MB 이하로 압축

Add-Type -AssemblyName System.Drawing

function Compress-Image {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [int]$MaxSizeMB = 9
    )
    
    try {
        # 원본 이미지 로드
        $image = [System.Drawing.Image]::FromFile($InputPath)
        
        # 원본 크기 확인
        $originalSizeMB = (Get-Item $InputPath).Length / 1MB
        Write-Host "압축 중: $([System.IO.Path]::GetFileName($InputPath)) ($([math]::Round($originalSizeMB, 2))MB)" -ForegroundColor Yellow
        
        # 리사이즈 (가로 1920px 이하로)
        $maxWidth = 1920
        $newWidth = $image.Width
        $newHeight = $image.Height
        
        if ($image.Width -gt $maxWidth) {
            $ratio = $maxWidth / $image.Width
            $newWidth = $maxWidth
            $newHeight = [int]($image.Height * $ratio)
            
            $resizedImage = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
            $graphics = [System.Drawing.Graphics]::FromImage($resizedImage)
            $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $graphics.DrawImage($image, 0, 0, $newWidth, $newHeight)
            $graphics.Dispose()
            
            $image.Dispose()
            $image = $resizedImage
        }
        
        # JPEG 인코더 설정
        $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        
        # 품질을 점진적으로 낮춰가며 압축
        $quality = 95
        while ($quality -gt 20) {
            $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $quality)
            
            $image.Save($OutputPath, $jpegCodec, $encoderParams)
            
            $fileSizeMB = (Get-Item $OutputPath).Length / 1MB
            
            if ($fileSizeMB -le $MaxSizeMB) {
                $reduction = (($originalSizeMB - $fileSizeMB) / $originalSizeMB) * 100
                Write-Host "  ✓ 압축 완료! $([math]::Round($fileSizeMB, 2))MB (품질: $quality, 감소: $([math]::Round($reduction, 1))%)" -ForegroundColor Green
                $image.Dispose()
                return $true
            }
            
            $quality -= 5
        }
        
        Write-Host "  ✗ 압축 실패: 목표 크기에 도달할 수 없음" -ForegroundColor Red
        $image.Dispose()
        return $false
        
    } catch {
        Write-Host "  ✗ 오류: $_" -ForegroundColor Red
        return $false
    }
}

# 메인 실행
Write-Host "`n🖼️  이미지 압축 시작...`n" -ForegroundColor Cyan

$imagesDir = "images"
$largeFiles = @("qntks.jpg", "skatks.jpg", "wpwn.jpg")

$successCount = 0
foreach ($file in $largeFiles) {
    $filePath = Join-Path $imagesDir $file
    
    if (Test-Path $filePath) {
        if (Compress-Image -InputPath $filePath -OutputPath $filePath -MaxSizeMB 9) {
            $successCount++
        }
        Write-Host ""
    } else {
        Write-Host "✗ $file: 파일을 찾을 수 없습니다`n" -ForegroundColor Red
    }
}

Write-Host "`n✅ 완료: $successCount/$($largeFiles.Count)개 파일 압축 성공`n" -ForegroundColor Green
Write-Host "이제 GitHub Issues에 업로드할 수 있습니다!`n" -ForegroundColor Cyan









