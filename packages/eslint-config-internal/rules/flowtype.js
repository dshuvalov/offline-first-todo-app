// Inspired by eslint-plugin-flowtype:recommended
module.exports = {
  plugins: ['flowtype'],
  rules: {
    // enforces a particular style for boolean type annotations
    // https://github.com/gajus/eslint-plugin-flowtype#boolean-style
    'flowtype/boolean-style': ['error', 'boolean'],

    // marks Flow type identifiers as defined
    // https://github.com/gajus/eslint-plugin-flowtype#define-flow-type
    'flowtype/define-flow-type': ['error'],

    // enforces consistent spacing within generic type annotation parameters
    // https://github.com/gajus/eslint-plugin-flowtype#generic-spacing
    'flowtype/generic-spacing': ['error', 'never'],

    // requires an empty line after the Flow annotation
    // https://github.com/gajus/eslint-plugin-flowtype#newline-after-flow-annotation
    'flowtype/newline-after-flow-annotation': ['error', 'always'],

    // disallows use of the existential type (*)
    // because it is deprecated
    // https://github.com/gajus/eslint-plugin-flowtype#no-existential-type
    'flowtype/no-existential-type': ['error'],

    // disallows use of primitive constructors as types, such as Boolean, Number and String
    // https://github.com/gajus/eslint-plugin-flowtype#no-primitive-constructor-types
    'flowtype/no-primitive-constructor-types': 'error',

    // disallows Flow type imports, aliases, and annotations in files
    // missing a valid Flow file declaration
    // https://github.com/gajus/eslint-plugin-flowtype#no-types-missing-file-annotation
    'flowtype/no-types-missing-file-annotation': ['error'],

    // warns against weak type annotations any, Object and Function
    // https://github.com/gajus/eslint-plugin-flowtype#no-weak-types
    'flowtype/no-weak-types': 'warn',

    // enforces consistent separators between properties in Flow object types
    // https://github.com/gajus/eslint-plugin-flowtype#object-type-delimiter
    'flowtype/object-type-delimiter': ['error', 'comma'],

    // this rule validates Flow file annotations
    // https://github.com/gajus/eslint-plugin-flowtype#require-valid-file-annotation
    'flowtype/require-valid-file-annotation': ['error', 'never', { annotationStyle: 'line' }],

    // enforces consistent use of semicolons after type aliases
    // https://github.com/gajus/eslint-plugin-flowtype#semi
    semi: ['off', 'never'],

    // enforces consistent spacing after the type annotation colon
    // https://github.com/gajus/eslint-plugin-flowtype#space-after-type-colon
    'flowtype/space-after-type-colon': ['error', 'always', { allowLineBreak: false }],

    // Enforces consistent spacing before the opening < of generic type annotation parameters
    // https://github.com/gajus/eslint-plugin-flowtype#space-before-generic-bracket
    'flowtype/space-before-generic-bracket': ['error', 'never'],

    // enforces consistent spacing before the type annotation colon
    // https://github.com/gajus/eslint-plugin-flowtype#space-before-type-colon
    'flowtype/space-before-type-colon': ['error', 'never'],

    // enforces a consistent naming pattern for type aliases
    // https://github.com/gajus/eslint-plugin-flowtype#type-id-match
    'flowtype/type-id-match': ['error', '^[A-Z][a-z0-9]*'],

    // enforces consistent spacing around union and intersection type separators (| and &)
    // https://github.com/gajus/eslint-plugin-flowtype#union-intersection-spacing
    'flowtype/union-intersection-spacing': ['error', 'always'],

    // marks Flow type alias declarations as used
    // https://github.com/gajus/eslint-plugin-flowtype#use-flow-type
    'flowtype/use-flow-type': ['error'],
  },
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: true,
    },
  },
}
