// PII and secret scrubber — regex-based, deterministic, zero latency.
// Replaces sensitive patterns with [REDACTED] before sending ratings to the API.

const PATTERNS: Array<[RegExp, string]> = [
  // Email addresses
  [/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[REDACTED_EMAIL]"],

  // Phone numbers (various formats)
  [/(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, "[REDACTED_PHONE]"],
  [/\+\d{1,3}[-.\s]?\d{4,14}/g, "[REDACTED_PHONE]"],

  // SSN / national IDs
  [/\b\d{3}-\d{2}-\d{4}\b/g, "[REDACTED_SSN]"],
  [/\b\d{9}\b(?=\s|$|[,.])/g, "[REDACTED_ID]"],

  // Credit card numbers (13-19 digits, optionally separated)
  [/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{1,7}\b/g, "[REDACTED_CC]"],

  // IP addresses
  [/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, "[REDACTED_IP]"],

  // URLs with auth tokens or credentials
  [/https?:\/\/[^\s]*[?&](token|key|secret|password|auth|access_token|api_key)=[^\s&]*/gi, "[REDACTED_URL]"],
  [/https?:\/\/[^@\s]+:[^@\s]+@[^\s]+/g, "[REDACTED_URL]"],

  // API keys — common prefixes
  [/\b(sk-[a-zA-Z0-9]{20,})\b/g, "[REDACTED_KEY]"],           // OpenAI / Anthropic
  [/\b(pk-[a-zA-Z0-9]{20,})\b/g, "[REDACTED_KEY]"],           // Public keys
  [/\b(ghp_[a-zA-Z0-9]{36,})\b/g, "[REDACTED_KEY]"],          // GitHub PAT
  [/\b(gho_[a-zA-Z0-9]{36,})\b/g, "[REDACTED_KEY]"],          // GitHub OAuth
  [/\b(github_pat_[a-zA-Z0-9_]{20,})\b/g, "[REDACTED_KEY]"],  // GitHub fine-grained
  [/\b(AKIA[A-Z0-9]{16})\b/g, "[REDACTED_KEY]"],              // AWS access key
  [/\b(xoxb-[a-zA-Z0-9-]+)\b/g, "[REDACTED_KEY]"],            // Slack bot token
  [/\b(xoxp-[a-zA-Z0-9-]+)\b/g, "[REDACTED_KEY]"],            // Slack user token
  [/\b(sk_live_[a-zA-Z0-9]{20,})\b/g, "[REDACTED_KEY]"],      // Stripe live
  [/\b(sk_test_[a-zA-Z0-9]{20,})\b/g, "[REDACTED_KEY]"],      // Stripe test
  [/\b(rk_live_[a-zA-Z0-9]{20,})\b/g, "[REDACTED_KEY]"],      // Stripe restricted
  [/\b(whsec_[a-zA-Z0-9]{20,})\b/g, "[REDACTED_KEY]"],        // Stripe webhook
  [/\b(SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43})\b/g, "[REDACTED_KEY]"], // SendGrid
  [/\b(Bearer\s+[a-zA-Z0-9._-]{20,})\b/gi, "[REDACTED_KEY]"], // Bearer tokens

  // Generic long hex/base64 strings that look like secrets (40+ chars, no spaces)
  [/\b[a-f0-9]{40,}\b/gi, "[REDACTED_HASH]"],

  // Environment variable assignments with values
  [/(API_KEY|SECRET|PASSWORD|TOKEN|PRIVATE_KEY|ACCESS_KEY|AUTH)\s*[=:]\s*\S+/gi, "[REDACTED_ENV]"],

  // Physical addresses (basic US pattern: number + street)
  [/\b\d{1,5}\s+[A-Z][a-zA-Z]+\s+(Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Way|Place|Pl)\b/gi, "[REDACTED_ADDRESS]"],
];

export function scrub(text: string): string {
  let result = text;
  for (const [pattern, replacement] of PATTERNS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

export function scrubObject(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      result[key] = scrub(value);
    } else if (typeof value === "object" && value !== null) {
      result[key] = scrubObject(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}
