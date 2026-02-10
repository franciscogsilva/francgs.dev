---
  title: 'Add git branch to linux terminal'
  author: 'Francisco Gonzalez'
  description: 'Add git branch to linux terminal.'
  pubDate: 2025-03-25
  image:
    url: 'https://assets.francgs.dev/add-git-branch-to-linux-terminal.jpg'
    alt: 'Add git branch to linux terminal'
  tags: ["git", "terminal", "linux"]
---

Add this to your `.bashrc` or `.zshrc` file:

```bash
# ==========================================
# GESTOR DE TEMAS PARA BASH PROMPT
# Descomenta el bloque del tema que prefieras
# ==========================================

# --- TEMA 1: TOKYO NIGHT (Tu configuración actual) ---
# USER_COLOR="\[\e[38;5;141m\]" # Purple
# PATH_COLOR="\[\e[38;5;117m\]" # Light Blue
# BRANCH_COLOR="\[\e[38;5;203m\]" # Red
# -----------------------------------------------------

# --- TEMA 2: THE MATRIX (Verde Hacker) ---
# USER_COLOR="\[\e[38;5;46m\]"  # Bright Green
# PATH_COLOR="\[\e[38;5;15m\]"  # White
# BRANCH_COLOR="\[\e[38;5;34m\]" # Darker Green
# -----------------------------------------------------

# --- TEMA 3: OCEAN BREEZE (Azules y Cian) ---
# USER_COLOR="\[\e[38;5;39m\]"  # Deep Sky Blue
# PATH_COLOR="\[\e[38;5;51m\]"  # Cyan
# BRANCH_COLOR="\[\e[38;5;27m\]" # Blue
# -----------------------------------------------------

# --- TEMA 4: SUNSET (Cálido: Naranja, Amarillo, Rosa) ---
# USER_COLOR="\[\e[38;5;208m\]" # Orange
# PATH_COLOR="\[\e[38;5;220m\]" # Gold/Yellow
# BRANCH_COLOR="\[\e[38;5;205m\]" # Hot Pink
# -----------------------------------------------------

# --- TEMA 5: CYBERPUNK (Neon: Rosa, Cian, Violeta) ---
# USER_COLOR="\[\e[38;5;198m\]" # Neon Pink
# PATH_COLOR="\[\e[38;5;87m\]"  # Aqua
# BRANCH_COLOR="\[\e[38;5;135m\]" # Purple
# -----------------------------------------------------

# --- TEMA 6: MONOCHROME (Minimalista Elegante) ---
# USER_COLOR="\[\e[1;37m\]"     # Bold White
# PATH_COLOR="\[\e[0;37m\]"     # Gray
# BRANCH_COLOR="\[\e[1;30m\]"   # Dark Gray
# -----------------------------------------------------

# --- TEMA 7: FOREST (Naturaleza) ---
# USER_COLOR="\[\e[38;5;118m\]" # Chartreuse
# PATH_COLOR="\[\e[38;5;155m\]" # Pale Green
# BRANCH_COLOR="\[\e[38;5;22m\]" # Dark Green
# -----------------------------------------------------

# --- CONFIGURACIÓN ACTIVA (Por defecto: TOKYO NIGHT) ---
# Si no descomentas nada arriba, usa estos por defecto o sobreescríbelos aquí
USER_COLOR="\[\e[38;5;141m\]"
PATH_COLOR="\[\e[38;5;117m\]"
BRANCH_COLOR="\[\e[38;5;203m\]"

# Reset
RESET='\[\e[0m\]'

# --- 2. LÓGICA DE GIT ---
GIT_VERSION=$(git --version 2>/dev/null | awk '{print $3}')
MIN_VERSION="2.22"

if [ "$(printf '%s\n' "$MIN_VERSION" "$GIT_VERSION" | sort -V | head -n1)" = "$MIN_VERSION" ]; then
    parse_git_branch() {
        local branch=$(git branch --show-current 2> /dev/null)
        if [ -n "$branch" ]; then
            echo "[$branch]"
        fi
    }
else
    parse_git_branch() {
        git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/^* \(.*\)/[\1]/'
    }
fi

# --- 3. ARMADO DEL PROMPT (PS1) ---
export PS1="${USER_COLOR}\u@\h ${PATH_COLOR}\w ${BRANCH_COLOR}\$(parse_git_branch)${RESET}$ "
```

save and reload the file

```bash
source ~/.bashrc
```

or

```bash
source ~/.zshrc
```
