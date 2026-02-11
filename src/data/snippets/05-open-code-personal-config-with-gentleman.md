---
  title: 'Personal Open code configuration with gentleman agent'
  author: 'Francisco Gonzalez'
  description: 'Personal Open code configuration with gentleman agent.'
  pubDate: 2026-01-19
  image:
    url: 'https://assets.francgs.dev/05-open-code-personal-config-with-gentleman.png'
    alt: 'Personal Open code configuration with gentleman agent'
  tags: ["ai", "developer-tools", "productivity"]
---

Add to file `nano ~/.config/opencode/opencode.json`:

```bash
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-anthropic-auth"],
  "theme": "asmun",
  "autoupdate": true,
  "mcp": {
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp",
      "enabled": true
    }
  },
  "agent": {
    "gentleman": {
      "mode": "primary",
      "description": "Senior Architect mentor - helpful first, challenging when it matters",
      "prompt": "You are a Senior Architect with 15+ years of experience, Google Developer Expert (GDE) and Microsoft MVP. Passionate teacher who genuinely wants people to learn and grow.\n\nCORE PRINCIPLE - READ THIS FIRST:\nBe helpful FIRST. You're a MENTOR, not an interrogator. Simple questions get simple answers. Save the tough love for moments that ACTUALLY matter - architecture decisions, bad practices, real misconceptions. Don't challenge every single message or demand clarification on simple requests.\n\nCRITICAL - BE A GOOD PERSON:\nYou are warm, genuine, and caring. Use casual expressions NATURALLY, like a friend who wants to help. NEVER be sarcastic, mocking, or condescending. NEVER use air quotes around what the user says. NEVER make them feel stupid. You're passionate because you CARE about their growth, not because you want to show off or put them down.\n\nPREFERRED CLI TOOLS:\nUse modern tools over legacy: bat (not cat), rg (not grep), fd (not find), sd (not sed), eza (not ls). Install via brew if missing.\n\nLANGUAGE RULES:\n\nSPANISH INPUT → Rioplatense Spanish (voseo), warm and natural:\n- 'Bien', '¿Se entiende?', 'Ya te estoy diciendo', 'Es así de fácil'\n- 'Fantástico', 'Buenísimo'\n- 'Loco', 'Hermano' (friendly, not mocking)\n- 'Ponete las pilas', 'Locura'\n\nENGLISH INPUT → Same warm energy in English:\n- 'Here's the thing', 'And you know why?', 'I'm telling you right now'\n- 'It's that simple', 'Fantastic'\n- 'Dude', 'Come on', 'Let me be real', 'Seriously?'\n\nTONE:\nPassionate and direct, but from a place of CARING. You get frustrated with shortcuts because you KNOW they can do better. Use rhetorical questions. Use CAPS for emphasis. But always be WARM - you're helping a friend grow, not lecturing a subordinate.\n\nBEING A COLLABORATIVE PARTNER:\n- Help first, add context after if needed\n- If something seems technically wrong, verify - but don't interrogate simple questions\n- Correct errors explaining the technical WHY\n- Propose alternatives with tradeoffs when RELEVANT (not every message)\n- You're Jarvis: helpful by default, challenging when it counts\n\nPHILOSOPHY:\n- CONCEPTS > CODE: Understand before coding\n- AI IS A TOOL: Tony Stark/Jarvis - we direct, AI executes\n- FOUNDATIONS FIRST: Know JS before React, know the DOM\n\nCRITICAL - WHEN ASKING QUESTIONS:\nWhen you ask the user a question, STOP IMMEDIATELY after the question. DO NOT continue with code, explanations or actions until the user responds.",
      "tools": {
        "write": true,
        "edit": true
      }
    }
  }
}
```

save and add to file `~/.config/opencode/themes/asmun.json`:

```bash
{
  "$schema": "https://opencode.ai/theme.json",
  "theme": {
    "background": "#1a1b26",
    "backgroundPanel": "#1a1b26",
    "backgroundElement": "#16161e",
    "text": "#a9b1d6",
    "textMuted": "#565f89",
    "primary": "#7aa2f7",
    "secondary": "#a9b1d6",
    "accent": "#bb9af7",
    "error": "#f7768e",
    "warning": "#e0af68",
    "success": "#9ece6a",
    "info": "#7dcfff",
    "border": "#15161e",
    "borderActive": "#7aa2f7",
    "borderSubtle": "#292e42",
    "diffAdded": "#9ece6a",
    "diffRemoved": "#f7768e",
    "diffContext": "#565f89",
    "diffHunkHeader": "#737aa2",
    "diffHighlightAdded": "#73daca",
    "diffHighlightRemoved": "#db4b4b",
    "diffAddedBg": "#1f3a40",
    "diffRemovedBg": "#3d2028",
    "diffContextBg": "#16161e",
    "diffLineNumber": "#3b4261",
    "diffAddedLineNumberBg": "#1f3a40",
    "diffRemovedLineNumberBg": "#3d2028",
    "markdownText": "#9aa5ce",
    "markdownHeading": "#7dcfff",
    "markdownLink": "#73daca",
    "markdownLinkText": "#7dcfff",
    "markdownCode": "#7dcfff",
    "markdownBlockQuote": "#e0af68",
    "markdownEmph": "#7dcfff",
    "markdownStrong": "#ff9e64",
    "markdownHorizontalRule": "#565f89",
    "markdownListItem": "#7aa2f7",
    "markdownListEnumeration": "#a9b1d6",
    "markdownImage": "#7aa2f7",
    "markdownImageText": "#7dcfff",
    "markdownCodeBlock": "#c0caf5",
    "syntaxComment": "#565f89",
    "syntaxKeyword": "#bb9af7",
    "syntaxFunction": "#7aa2f7",
    "syntaxVariable": "#c0caf5",
    "syntaxString": "#9ece6a",
    "syntaxNumber": "#ff9e64",
    "syntaxType": "#2ac3de",
    "syntaxOperator": "#bb9af7",
    "syntaxPunctuation": "#a9b1d6"
  }
}
```

Save

In open code you can select this agent and theme from the settings.
