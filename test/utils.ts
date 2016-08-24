import * as test from 'tape'
import { hyphenCase } from '../src/utils'

test('utils', t => {
  t.test('hyphenCase', t => {
    t.ok('foo-bar-baz' === hyphenCase('fooBarBaz'), 'fooBarBaz should be foo-bar-baz')
    t.end()
  })
})