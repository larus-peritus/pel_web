#!/usr/bin/env python3
"""
Utility: Work Context Helper

Functions to read and manage work context across Python hooks and scripts.
"""

import json
from pathlib import Path
from typing import Optional, Dict


def get_work_context() -> Optional[str]:
    """
    Get the current work context app name.
    
    Returns:
        App name if context is set, None otherwise
    """
    context_file = Path(".claude-work-context.json")
    
    if not context_file.exists():
        return None
    
    try:
        with open(context_file, 'r') as f:
            context_data = json.load(f)
        return context_data.get("current_app")
    except (json.JSONDecodeError, IOError):
        return None


def get_work_context_full() -> Optional[Dict[str, str]]:
    """
    Get the full work context data.
    
    Returns:
        Dictionary with context data or None if not set
    """
    context_file = Path(".claude-work-context.json")
    
    if not context_file.exists():
        return None
    
    try:
        with open(context_file, 'r') as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return None


def has_work_context() -> bool:
    """
    Check if work context is set.
    
    Returns:
        True if context is set, False otherwise
    """
    return get_work_context() is not None


def get_work_context_with_message() -> Optional[str]:
    """
    Get work context and print a message to stderr.
    
    Returns:
        App name if context is set, None otherwise
    """
    import sys
    
    app_name = get_work_context()
    
    if app_name:
        print(f"📍 Using work context: {app_name}", file=sys.stderr)
    
    return app_name


def set_work_context(app_name: str, previous_app: Optional[str] = None) -> bool:
    """
    Set the work context to a specific app.
    
    Args:
        app_name: Name of the app to set as context
        previous_app: Optional previous app name
    
    Returns:
        True if successful, False otherwise
    """
    from datetime import datetime
    
    # Validate app exists
    app_dir = Path("apps") / app_name
    if not app_dir.exists():
        return False
    
    # Get current context if exists
    if previous_app is None:
        current_context = get_work_context_full()
        if current_context:
            previous_app = current_context.get("current_app")
    
    # Create context data
    context_data = {
        "current_app": app_name,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "previous_app": previous_app or ""
    }
    
    # Write context file
    try:
        with open(".claude-work-context.json", 'w') as f:
            json.dump(context_data, f, indent=2)
        return True
    except IOError:
        return False


def clear_work_context() -> Optional[str]:
    """
    Clear the work context.
    
    Returns:
        The previous app name if context was set, None otherwise
    """
    context_file = Path(".claude-work-context.json")
    
    if not context_file.exists():
        return None
    
    # Get previous app before deleting
    previous_app = get_work_context()
    
    try:
        context_file.unlink()
        return previous_app
    except IOError:
        return None


# Example usage
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "--set":
            if len(sys.argv) > 2:
                if set_work_context(sys.argv[2]):
                    print(f"✅ Context set to: {sys.argv[2]}")
                else:
                    print(f"❌ Failed to set context to: {sys.argv[2]}")
                    sys.exit(1)
            else:
                print("Usage: work_context.py --set [app-name]")
                sys.exit(1)
        elif sys.argv[1] == "--clear":
            prev = clear_work_context()
            if prev:
                print(f"✅ Context cleared (was: {prev})")
            else:
                print("No context was set")
        elif sys.argv[1] == "--check":
            full_context = get_work_context_full()
            if full_context:
                print(json.dumps(full_context, indent=2))
            else:
                print("No context set")
    else:
        # Default: just print current context
        app_name = get_work_context()
        if app_name:
            print(app_name)
        else:
            sys.exit(1)


