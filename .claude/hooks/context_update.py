#!/usr/bin/env python3
"""
Hook: Context Update

Triggered when context files are updated.
Validates context structure and logs updates.

Usage: Called automatically via PostToolUse hook when Write/Edit tools update context/ directory.
"""

import json
import sys
from datetime import datetime
from pathlib import Path

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
    
    # Check if this is a context file update
    if tool_name in ["Write", "Edit"]:
        file_path = tool_args.get("file_path", "")
        
        # Check if this is a context directory update
        if "context/" in file_path:
            validate_and_log_context_update(file_path)
    
    sys.exit(0)

def validate_and_log_context_update(context_file: str):
    """Validate context file and log the update"""
    project_dir = Path.cwd()
    log_file = project_dir / "context" / "update.log"
    
    # Ensure context directory exists
    log_file.parent.mkdir(parents=True, exist_ok=True)
    
    # Determine file type
    file_type = determine_context_file_type(context_file)
    
    # Validate structure (basic check)
    is_valid = validate_context_file(context_file, file_type)
    
    # Log the update
    timestamp = datetime.now().isoformat()
    status = "✅" if is_valid else "⚠️"
    log_entry = f"[{timestamp}] {status} Context updated: {context_file} ({file_type})\n"
    
    with open(log_file, "a") as f:
        f.write(log_entry)
    
    if is_valid:
        print(f"✅ Context validated: {context_file}")
    else:
        print(f"⚠️ Context may need review: {context_file}")

def determine_context_file_type(file_path: str) -> str:
    """Determine what type of context file this is"""
    if "architecture.md" in file_path:
        return "architecture"
    elif "IMPLEMENTATION_STATUS.md" in file_path:
        return "status"
    elif "context/features/" in file_path:
        return "feature"
    elif "context/modules/" in file_path:
        return "module"
    else:
        return "unknown"

def validate_context_file(file_path: str, file_type: str) -> bool:
    """Basic validation of context file structure"""
    try:
        file = Path(file_path)
        if not file.exists():
            return False
        
        content = file.read_text()
        
        # Basic validation based on type
        if file_type == "module":
            # Should have: Location, Purpose, Exports sections
            required = ["## Location", "## Purpose", "## Exports"]
            return all(section in content for section in required)
        
        elif file_type == "feature":
            # Should have: Overview, Status, Modules sections
            required = ["## Overview", "## Status", "## Modules"]
            return all(section in content for section in required)
        
        elif file_type == "status":
            # Should have: Summary, Feature sections
            required = ["## Summary", "## Feature:"]
            return all(section in content for section in required)
        
        # If we can't validate, assume it's okay
        return True
        
    except Exception as e:
        print(f"Warning: Validation error: {e}", file=sys.stderr)
        return False

if __name__ == "__main__":
    main()


