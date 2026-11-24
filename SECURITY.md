# 🔒 Security Policy — CodeQuest 3D

We take the security and integrity of **CodeQuest 3D** seriously. We welcome responsible security reports from researchers and community members.

---

## 🛡️ Supported Versions

As CodeQuest 3D is currently in active development, security updates and patches are applied exclusively to the latest active development branch:

| Branch / Release | Supported | Notes |
|---|---|---|
| `main` | ✅ Yes | Active development branch |
| `< 0.1.0` | ❌ No | Historical prototype branches |

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability or exploit in CodeQuest 3D, please **do not open a public GitHub issue**. Public disclosure before a fix is available puts learners and deployments at risk.

Instead, please report vulnerabilities privately:

1. **Email:** Send details to **[shubhamjrd4559@gmail.com](mailto:shubhamjrd4559@gmail.com)**.
2. **Subject:** `[SECURITY] CodeQuest 3D Vulnerability Report - <Brief Summary>`
3. **Include the following information:**
   - Type of vulnerability (e.g., JWT token bypass, SQL injection, XSS, insecure direct object reference).
   - Component affected (frontend route, API endpoint, or backend model).
   - Step-by-step reproduction guide or proof-of-concept payload.
   - Potential impact of the vulnerability.
   - Proposed mitigation or patch (if you have one).

---

## ⏱️ Response & Remediation Timeline

- **Initial Acknowledgment:** Within **48 hours** of receiving your report.
- **Vulnerability Assessment:** Within **5 business days**, we will confirm the issue, rate its severity using CVSS metrics, and outline a resolution plan.
- **Patch & Release:** We will work to release a fix promptly, coordinate testing, and push the update to `main`.
- **Public Disclosure:** Once the fix has landed on `main`, credit will be awarded to the reporter in our release notes (unless anonymity is requested).

---

## 🚫 Out of Scope

The following types of issues are generally considered out of scope:
- Rate-limiting or denial-of-service against local development servers (`localhost:3000` / `localhost:8000`).
- Reports generated exclusively by automated scanning tools without reproducible proof-of-concept impact.
- Vulnerabilities in third-party development dependencies that do not have practical exploit paths in our codebase.
