$directory = 'C:\Users\Nurul Islam Dipu\.gemini\antigravity\scratch\TANSU-NIRALOY'
$emojis = @('🏢', '📊', '💰', '💸', '🏦', '⏳', '✅', '🛡️', '🖨️', 'ℹ️', '📍', '⚠️', '✓', '🔑', '🛏️', '🚿', '📏', '🏠', '📋', '⚙️', '🚪', '📅', '💳', '📈', '📉', '✖️', '💬', '🔧', '🚀', '🏡', '•', '●', '©')

Get-ChildItem -Path $directory -Include *.html,*.js -Recurse | ForEach-Object {
    $content = [System.IO.File]::ReadAllText($_.FullName, [System.Text.Encoding]::UTF8)
    $original = $content
    
    $content = $content.Replace('৳', 'BDT ')
    foreach ($emoji in $emojis) {
        $content = $content.Replace($emoji, '')
    }
    
    if ($content -cne $original) {
        [System.IO.File]::WriteAllText($_.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host ('Updated ' + $_.Name)
    }
}
