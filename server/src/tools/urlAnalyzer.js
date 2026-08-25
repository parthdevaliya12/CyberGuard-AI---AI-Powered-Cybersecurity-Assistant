/**
 * Analyze a URL for potential security risks using safe, non-invasive indicators.
 * @param {Object} params - { url }
 * @returns {Object} - Risk analysis results
 */
const urlRiskAnalyzer = ({ url }) => {
  try {
    const indicators = [];
    let riskScore = 0;

    // Validate URL format
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch {
      return {
        url,
        riskLevel: 'High',
        riskScore: 80,
        indicators: ['Invalid URL format — cannot be parsed safely'],
        recommendation: 'This does not appear to be a valid URL. Do not visit it.',
      };
    }

    // Check 1: HTTPS
    if (parsedUrl.protocol !== 'https:') {
      indicators.push('Does not use HTTPS (insecure connection)');
      riskScore += 20;
    } else {
      indicators.push('Uses HTTPS (encrypted connection) ✓');
    }

    // Check 2: URL length
    if (url.length > 100) {
      indicators.push(`Unusually long URL (${url.length} characters)`);
      riskScore += 10;
    }

    // Check 3: Suspicious keywords
    const suspiciousKeywords = [
      'login', 'verify', 'account', 'secure', 'update', 'confirm',
      'banking', 'password', 'credential', 'suspend', 'urgent',
      'click-here', 'free', 'winner', 'prize', 'alert',
    ];
    const urlLower = url.toLowerCase();
    const foundKeywords = suspiciousKeywords.filter((kw) => urlLower.includes(kw));
    if (foundKeywords.length > 0) {
      indicators.push(`Contains suspicious keywords: ${foundKeywords.join(', ')}`);
      riskScore += foundKeywords.length * 5;
    }

    // Check 4: Excessive subdomains
    const hostParts = parsedUrl.hostname.split('.');
    if (hostParts.length > 4) {
      indicators.push(`Excessive subdomains (${hostParts.length - 2} subdomains)`);
      riskScore += 15;
    }

    // Check 5: IP address instead of domain
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipRegex.test(parsedUrl.hostname)) {
      indicators.push('Uses IP address instead of domain name');
      riskScore += 25;
    }

    // Check 6: Suspicious characters
    const suspiciousChars = ['@', '%', '..', '--'];
    const foundChars = suspiciousChars.filter((ch) => url.includes(ch));
    if (foundChars.length > 0) {
      indicators.push(`Contains suspicious characters: ${foundChars.join(', ')}`);
      riskScore += 15;
    }

    // Check 7: Known safe TLDs vs suspicious TLDs
    const suspiciousTLDs = ['.xyz', '.top', '.click', '.buzz', '.tk', '.ml', '.ga', '.cf'];
    const tld = '.' + hostParts[hostParts.length - 1];
    if (suspiciousTLDs.includes(tld)) {
      indicators.push(`Uses potentially suspicious TLD: ${tld}`);
      riskScore += 15;
    }

    // Check 8: Port number in URL
    if (parsedUrl.port && parsedUrl.port !== '443' && parsedUrl.port !== '80') {
      indicators.push(`Uses non-standard port: ${parsedUrl.port}`);
      riskScore += 10;
    }

    // Cap score at 100
    riskScore = Math.min(riskScore, 100);

    // Determine risk level
    let riskLevel;
    let recommendation;

    if (riskScore <= 20) {
      riskLevel = 'Low';
      recommendation =
        'This URL appears relatively safe based on basic indicators. However, always exercise caution and verify the source before entering any personal information.';
    } else if (riskScore <= 50) {
      riskLevel = 'Medium';
      recommendation =
        'This URL has some concerning indicators. Proceed with caution. Verify the source independently before clicking. Do not enter sensitive information unless you are confident the site is legitimate.';
    } else {
      riskLevel = 'High';
      recommendation =
        'This URL has multiple risk indicators. We recommend NOT visiting this URL. If you must check it, use a URL scanning service like VirusTotal. Never enter credentials or personal information on suspicious sites.';
    }

    return {
      url,
      riskLevel,
      riskScore,
      indicators,
      recommendation,
    };
  } catch (error) {
    return {
      url,
      riskLevel: 'Unknown',
      riskScore: 0,
      indicators: ['Error analyzing URL'],
      recommendation: 'Unable to analyze the URL. Exercise caution.',
    };
  }
};

module.exports = urlRiskAnalyzer;
