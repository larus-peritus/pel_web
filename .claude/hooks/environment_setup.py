#!/usr/bin/env python3
"""
Hook: Environment Setup

Triggered when environment setup is complete.
Logs the setup and validates the environment.

Usage: Called automatically via PostToolUse hook when environment-setup-agent creates apps directory.
"""

import json
import sys
from datetime import datetime
from pathlib import Path
import subprocess

def main():
    # Read hook input from stdin
    try:
        hook_input = json.loads(sys.stdin.read())
    except json.JSONDecodeError:
        print("Error: Invalid JSON input", file=sys.stderr)
        sys.exit(1)
    
    # Extract tool use information
    tool_name = hook_input.get("tool_name", "")
    tool_args = hook_input.get("tool_arguments", {})
    
    # Check if this is apps directory creation
    if tool_name == "Bash":
        command = tool_args.get("command", "")
        
        # Check if creating apps directory
        if "mkdir" in command and "apps/" in command:
            # Extract app name from command
            parts = command.split("apps/")
            if len(parts) > 1:
                app_name = parts[1].split("/")[0]
                log_environment_setup(app_name)
                
                # Optional: Announce completion
                try:
                    announce_setup_complete(app_name)
                except Exception as e:
                    print(f"Warning: Could not announce: {e}", file=sys.stderr)
    
    sys.exit(0)

def log_environment_setup(app_name: str):
    """Log environment setup to context"""
    project_dir = Path.cwd()
    log_file = project_dir / "context" / "setup.log"
    
    # Ensure context directory exists
    log_file.parent.mkdir(parents=True, exist_ok=True)
    
    timestamp = datetime.now().isoformat()
    log_entry = f"[{timestamp}] Environment setup completed: apps/{app_name}/\n"
    
    with open(log_file, "a") as f:
        f.write(log_entry)
    
    print(f"✅ Logged environment setup: apps/{app_name}/")
    
    # Verify setup
    app_dir = project_dir / "apps" / app_name
    if app_dir.exists():
        verify_environment(app_dir, app_name)

def verify_environment(app_dir: Path, app_name: str):
    """Verify environment is properly set up"""
    checks = {
        "Directory exists": app_dir.exists(),
        "src/ exists": (app_dir / "src").exists(),
        "tests/ exists": (app_dir / "tests").exists(),
        "package.json exists": (app_dir / "package.json").exists() or 
                               (app_dir / "pyproject.toml").exists() or
                               (app_dir / "go.mod").exists(),
        "README.md exists": (app_dir / "README.md").exists(),
        ".gitignore exists": (app_dir / ".gitignore").exists(),
    }
    
    all_passed = all(checks.values())
    
    if all_passed:
        print(f"✅ Environment verification passed for {app_name}")
    else:
        print(f"⚠️ Some environment checks failed for {app_name}:")
        for check, passed in checks.items():
            status = "✅" if passed else "❌"
            print(f"  {status} {check}")

def announce_setup_complete(app_name: str):
    """Announce setup completion via TTS (optional, macOS only)"""
    import shutil
    if shutil.which("say"):
        message = f"Environment setup complete for {app_name}"
        subprocess.run(["say", message], check=False)

if __name__ == "__main__":
    main()


