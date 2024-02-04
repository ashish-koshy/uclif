export type VSCodeSettings = {
    'files.exclude'?: Record<string, boolean>,
    'search.exclude'?: Record<string, boolean>,
    'files.watcherExclude'?: Record<string, boolean>,
    'editor.codeActionsOnSave'?: {
        'source.fixAll.eslint'?: boolean,
        'source.organizeImports'?: boolean,
    },
    'editor.bracketPairColorization.enabled'?: boolean,
    '[html]'?: {
        'editor.defaultFormatter'?: string,
        'editor.formatOnSave'?: boolean
    },
    '[scss]'?: {
        'editor.defaultFormatter'?: string,
        'editor.formatOnSave'?: boolean
    },
    '[typescript]'?: {
        'editor.tabSize'?: number,
        'editor.defaultFormatter'?: string,
        'editor.formatOnSave'?: boolean
    },
    'editor.insertSpaces'?: boolean
}
