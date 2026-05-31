
const SYSTEM_PROMPT = `You are a brutally honest, expert UI/UX design critic with 15 years of experience at top design firms. You give specific, actionable critique — never vague platitudes.

Analyze the provided UI screenshot and respond ONLY with a valid JSON object. No preamble, no markdown fences, no extra text. Only JSON.

The JSON must follow this exact structure:
{
  "overall": 72,
  "summary": "One punchy sentence (max 25 words) that captures the biggest design problem or strength.",
  "scores": {
    "hierarchy": 65,
    "spacing": 80,
    "color": 55,
    "typography": 70,
    "contrast": 90,
    "ux": 60
  },
  "issues": [
    {
      "severity": "critical",
      "title": "Short issue title",
      "description": "Specific description of the problem, referencing actual elements visible in the screenshot.",
      "fix": "Concrete, actionable fix. Be specific."
    }
  ]
}

Rules:
- Scores are integers 0–100
- summary must be punchy and opinionated, like a design critic — not a corporate HR response
- issues array: 3 to 6 items, sorted by severity (critical → major → minor)
- severity must be one of: "critical", "major", "minor"
- Every issue must reference something actually visible in the screenshot
- Fixes must be specific: not "improve spacing" but "increase padding between nav items to at least 24px"
- Be honest. If it's good, say so. If it's bad, say so. No hedging.
`;

const LOADING_MESSAGES = [
  'analyzing your design...',
  'counting spacing violations...',
  'judging your font choices...',
  'calculating visual hierarchy...',
  'preparing the roast...',
];

// API key (may be injected via environment in some runtimes)
const apiKey = (typeof process !== 'undefined' && process.env && process.env.CLAUDE_API_KEY) || '';

async function runRoast() {
  if (!uploadedImageBase64) return;

  // Show loading
  const uploadSection = document.querySelector('.upload-section');
  const loadingSection = document.getElementById('loadingSection');
  const resultsSection = document.getElementById('resultsSection');

  uploadSection.style.display = 'none';
  loadingSection.style.display = 'flex';
  resultsSection.style.display = 'none';

  // Animate loading messages
  let msgIdx = 0;
  const loadingText = document.getElementById('loadingText');
  const loadingFill = document.getElementById('loadingFill');
  const msgInterval = setInterval(() => {
    msgIdx = (msgIdx + 1) % LOADING_MESSAGES.length;
    loadingText.textContent = LOADING_MESSAGES[msgIdx];
    loadingFill.style.width = `${Math.min((msgIdx + 1) * 18, 85)}%`;
  }, 1200);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': "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",
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: uploadedMimeType,
                data: uploadedImageBase64,
              }
            },
            {
              type: 'text',
              text: 'Roast this UI design. Be specific and brutal.'
            }
          ]
        }]
      })
    });

    const data = await response.json();
    const rawText = data.content.map(b => b.text || '').join('');
    const cleaned = rawText.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned);

    clearInterval(msgInterval);
    loadingFill.style.width = '100%';

    setTimeout(() => {
      loadingSection.style.display = 'none';
      renderResults(result);
    }, 400);

  } catch (err) {
    clearInterval(msgInterval);
    loadingSection.style.display = 'none';
    uploadSection.style.display = 'block';
    alert('Something went wrong analyzing the image. Check your API key and try again.\n\n' + err.message);
    console.error(err);
  }
}

function copyResults() {
  const scoresEl = document.getElementById('scoresGrid');
  const summaryEl = document.getElementById('summaryCard');
  const issuesEl = document.getElementById('issuesList');
  const text = [scoresEl, summaryEl, issuesEl]
    .map(el => el?.innerText || '')
    .join('\n\n');
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.action-btn--primary');
    const orig = btn.textContent;
    btn.textContent = 'copied!';
    setTimeout(() => btn.textContent = orig, 1500);
  });
}