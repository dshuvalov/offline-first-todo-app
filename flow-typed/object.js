// @flow

/**
 * @description Replacement for Object type. Object type was replaced by any in 0.88.0 version of flow
 * (@link https://github.com/facebook/flow/releases/tag/v0.88.0).
 * It is global type that doesn't need export, just use this in your cases.
 */
type $AnyObject = { [key: string]: any }
