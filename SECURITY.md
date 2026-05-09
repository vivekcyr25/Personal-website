# Security Policy

## Supported Versions

We actively provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | ✅ Yes              |
| < 1.0   | ❌ No               |

## Reporting a Vulnerability

We take the security of the Neural OS platform seriously. If you discover a vulnerability, please do not disclose it publicly. Instead, follow these steps:

1. **Email us**: Send a detailed report to security@viveksharma.dev (placeholder).
2. **Include Details**: Provide a description of the vulnerability, steps to reproduce, and potential impact.
3. **Response**: We will acknowledge your report within 48 hours and provide a timeline for resolution.

## Security Standards

Neural OS follows industry-standard security practices:
- **Secret Scanning**: We use automated tools to prevent secret leaks.
- **Environment Isolation**: Production secrets are never stored in version control.
- **Rate Limiting**: Protection against automated brute-force attacks.
- **Secure Headers**: Using Helmet.js to mitigate common web vulnerabilities.
