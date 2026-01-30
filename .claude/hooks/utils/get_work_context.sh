#!/bin/bash
# Utility: Get Work Context
# 
# Returns the current work context app name from .claude-work-context.json
# Usage: source .claude/hooks/utils/get_work_context.sh
#        APP_NAME=$(get_work_context)

get_work_context() {
    local context_file=".claude-work-context.json"
    
    if [ -f "$context_file" ]; then
        # Extract current_app from JSON
        if command -v jq &> /dev/null; then
            jq -r '.current_app' "$context_file" 2>/dev/null
        else
            # Fallback if jq not available
            grep -o '"current_app"[[:space:]]*:[[:space:]]*"[^"]*"' "$context_file" | \
                sed 's/.*"\([^"]*\)".*/\1/'
        fi
    else
        echo ""
    fi
}

get_work_context_with_message() {
    local app_name=$(get_work_context)
    
    if [ -n "$app_name" ]; then
        echo "📍 Using work context: $app_name" >&2
        echo "$app_name"
    else
        echo ""
    fi
}

has_work_context() {
    local app_name=$(get_work_context)
    [ -n "$app_name" ]
}

# If sourced, just provide functions
# If executed directly, output context
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    get_work_context
fi


