export type PrettierProfileType = 'prettier' | 'angular'

export type PrettierOverride = {
    files?: string,
    options?: {
        parser?: string
    }
}

export type PrettierProfileRecord = {
    packages?: string[],
    overrides?: PrettierOverride[]
}

export type PrettierProfile = Record<
    string,
    () => PrettierProfileRecord
>

export type PrettierConfig = {
    trailingComma?: string,
    printWidth?: number,
    singleQuote?: boolean,
    useTabs?: boolean,
    tabWidth?: number,
    semi?: boolean,
    bracketSpacing?: boolean,
    overrides?: PrettierOverride[]
}

export type PrettierDefaults = {
    commonConfig: () => PrettierConfig,
    profiles: () => PrettierProfile,
}
