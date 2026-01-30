#!/usr/bin/env python3
"""
Hook: Task Complete

Triggered when a builder-agent completes a task.
Detects completion markers, logs completion, and provides notifications.

Usage: Called automatically via PostToolUse hook when Write tool updates a task file
or when a completion marker file is created.
"""

import json
import sys
import os
import subprocess
import shutil
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
    
    # Check for completion marker file (highest priority)
    if tool_name == "Write":
        file_path = tool_args.get("file_path", "")
        
        # Check if this is the completion marker
        if file_path.endswith(".builder-completion.json"):
            handle_completion_marker(file_path)
            sys.exit(0)
    
    # Check if this is a task file update (fallback detection)
    if tool_name == "Write" or tool_name == "Edit":
        file_path = tool_args.get("file_path", "")
        
        # Check if this is a tasks file being updated (multi-app aware)
        if "specs/" in file_path and "-tasks.md" in file_path:
            log_task_update(file_path)
            
            # Trigger text-to-speech notification
            try:
                announce_task_complete(file_path)
            except Exception as e:
                print(f"Warning: Could not announce completion: {e}", file=sys.stderr)
    
    sys.exit(0)

def handle_completion_marker(marker_file: str):
    """Handle the completion marker file created by builder-agent"""
    project_dir = Path.cwd()
    marker_path = project_dir / marker_file
    
    if not marker_path.exists():
        return
    
    try:
        # Read completion metadata
        with open(marker_path, 'r') as f:
            completion_data = json.load(f)
        
        task_id = completion_data.get("task_id", "Unknown")
        feature_name = completion_data.get("feature_name", "Unknown")
        app_name = completion_data.get("app_name", "Unknown")
        files_created = completion_data.get("files_created", [])
        timestamp = completion_data.get("timestamp", datetime.now().isoformat())
        
        # Log completion with full details
        log_completion_details(app_name, feature_name, task_id, files_created, timestamp)
        
        # Trigger comprehensive notification
        announce_builder_completion(app_name, feature_name, task_id)
        
        # Display completion summary
        print(f"\n{'='*60}")
        print(f"✅ BUILDER AGENT COMPLETE")
        print(f"{'='*60}")
        print(f"App: {app_name}")
        print(f"Feature: {feature_name}")
        print(f"Task: {task_id}")
        print(f"Files: {len(files_created)} created/modified")
        print(f"Time: {timestamp}")
        print(f"{'='*60}\n")
        
        # Clean up marker file
        marker_path.unlink()
        
    except Exception as e:
        print(f"Error processing completion marker: {e}", file=sys.stderr)

def log_completion_details(app_name: str, feature_name: str, task_id: str, files_created: list, timestamp: str):
    """Log detailed completion information"""
    project_dir = Path.cwd()
    
    # Create app-specific log directory
    log_dir = project_dir / "apps" / app_name / "context" / "logs"
    log_dir.mkdir(parents=True, exist_ok=True)
    
    # Log to app-specific completion log
    log_file = log_dir / "task_completions.log"
    
    log_entry = {
        "timestamp": timestamp,
        "app": app_name,
        "feature": feature_name,
        "task_id": task_id,
        "files_created": files_created
    }
    
    # Append to JSONL format for easy parsing
    with open(log_file, "a") as f:
        f.write(json.dumps(log_entry) + "\n")
    
    print(f"📝 Logged completion: {app_name}/{feature_name}/Task {task_id}")

def log_task_update(task_file: str):
    """Log task file update (fallback detection method)"""
    project_dir = Path.cwd()
    
    # Extract app name if in multi-app structure
    if task_file.startswith("apps/"):
        parts = task_file.split("/")
        if len(parts) >= 2:
            app_name = parts[1]
            log_dir = project_dir / "apps" / app_name / "context" / "logs"
        else:
            log_dir = project_dir / "context" / "logs"
    else:
        log_dir = project_dir / "context" / "logs"
    
    log_dir.mkdir(parents=True, exist_ok=True)
    
    log_file = log_dir / "task_updates.log"
    
    timestamp = datetime.now().isoformat()
    log_entry = f"[{timestamp}] Task file updated: {task_file}\n"
    
    with open(log_file, "a") as f:
        f.write(log_entry)
    
    print(f"📝 Logged task update: {task_file}")

def announce_builder_completion(app_name: str, feature_name: str, task_id: str):
    """Announce builder completion via TTS"""
    # Construct a clear, informative message
    message = f"Builder agent complete. {app_name}. {feature_name}. Task {task_id}."
    
    # Try system say command first (macOS)
    if shutil.which("say"):
        try:
            subprocess.run(["say", message], check=False, timeout=10)
            return
        except (subprocess.TimeoutExpired, subprocess.SubprocessError):
            pass
    
    # Try advanced TTS via uv run if available
    script_dir = Path(__file__).parent
    tts_dir = script_dir / "utils" / "tts"
    
    # Try ElevenLabs if available
    if os.getenv("ELEVENLABS_API_KEY"):
        elevenlabs_script = tts_dir / "elevenlabs_tts.py"
        if elevenlabs_script.exists():
            try:
                subprocess.run(
                    ["uv", "run", str(elevenlabs_script), message],
                    capture_output=True,
                    timeout=10
                )
                return
            except (subprocess.TimeoutExpired, subprocess.SubprocessError, FileNotFoundError):
                pass
    
    # Try OpenAI TTS if available
    if os.getenv("OPENAI_API_KEY"):
        openai_script = tts_dir / "openai_tts.py"
        if openai_script.exists():
            try:
                subprocess.run(
                    ["uv", "run", str(openai_script), message],
                    capture_output=True,
                    timeout=10
                )
                return
            except (subprocess.TimeoutExpired, subprocess.SubprocessError, FileNotFoundError):
                pass
    
    # Try pyttsx3 as fallback
    pyttsx3_script = tts_dir / "pyttsx3_tts.py"
    if pyttsx3_script.exists():
        try:
            subprocess.run(
                ["uv", "run", str(pyttsx3_script), message],
                capture_output=True,
                timeout=10
            )
        except (subprocess.TimeoutExpired, subprocess.SubprocessError, FileNotFoundError):
            pass

def announce_task_complete(task_file: str):
    """Announce task completion via TTS (fallback method)"""
    feature_name = extract_feature_name(task_file)
    
    # Extract app name if in multi-app structure
    app_name = "app"
    if task_file.startswith("apps/"):
        parts = task_file.split("/")
        if len(parts) >= 2:
            app_name = parts[1]
    
    message = f"Task complete for {feature_name} in {app_name}"
    
    # Only announce if say command is available (macOS)
    if shutil.which("say"):
        subprocess.run(["say", message], check=False)

def extract_feature_name(task_file: str) -> str:
    """Extract feature name from task file path"""
    # Example: apps/recipe-app/specs/user-authentication-tasks.md -> user-authentication
    # Example: specs/user-authentication-tasks.md -> user-authentication
    filename = Path(task_file).stem  # Remove .md
    if filename.endswith("-tasks"):
        return filename[:-6]  # Remove -tasks
    return filename

if __name__ == "__main__":
    main()
