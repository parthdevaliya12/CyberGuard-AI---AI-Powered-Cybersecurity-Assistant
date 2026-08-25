const urlRiskAnalyzer = require('../src/tools/urlAnalyzer');

describe('URL Analyzer', () => {
  it('should detect a safe URL', () => {
    const result = urlRiskAnalyzer({ url: 'https://www.google.com' });
    expect(result.riskScore).toBeLessThan(40);
    expect(result.riskLevel).toBe('Low');
  });

  it('should detect a suspicious URL (http, IP address)', () => {
    const result = urlRiskAnalyzer({ url: 'http://192.168.1.1/login' });
    expect(result.riskScore).toBeGreaterThanOrEqual(40);
    expect(result.indicators.some(ind => ind.includes('Uses IP address instead of domain name'))).toBe(true);
    expect(result.indicators.some(ind => ind.includes('Does not use HTTPS'))).toBe(true);
  });

  it('should flag URLs with suspicious keywords', () => {
    const result = urlRiskAnalyzer({ url: 'https://secure-login-update-account.com' });
    expect(result.indicators.some(ind => ind.includes('Contains suspicious keywords'))).toBe(true);
  });

  it('should handle invalid URLs gracefully', () => {
    const result = urlRiskAnalyzer({ url: 'not-a-valid-url' });
    expect(result.riskScore).toBe(80);
    expect(result.riskLevel).toBe('High');
    expect(result.indicators.some(ind => ind.includes('Invalid URL format'))).toBe(true);
  });
});
