import './utils'

import * as test from 'tape'
import angular from '../src'
import { primitiveTypes, dustTemplate } from 'protoapp'

test('index', t => {
  t.test('default', t => {
    let plugin = angular({
      dirname: __dirname,
      generateImportsService (node: any) { },
      generateImportsMessage (node: any) { },
      primitiveTypes,
      dustTemplate
    })

    t.test('visitor', t => {
      let { Message, Service } = plugin.visitor

      t.test('Message', t => {
        let messageNode = {
          name: "GetNoteRequest",
          fields: [
            {
              rule: "optional",
              type: "Note",
              name: "note",
              id: 1
            }
          ]
        }

        let result = [
          {
            type: 'interface',
            files: [
              { filename: 'get-note-request.ts', body: '\nexport interface GetNoteRequest {\n    note?: Note;\n\n}\n' }
            ]
          }
        ]

        Message(messageNode, ['rifl'])
          .then(x => {
            t.deepEqual(x, result)
            t.end()
          })
      })

      t.test('Service', t => {
        let serviceNode = {
          name: "Notes",
          options: {},
          rpc: {
            CreateNote: {
              request: "CreateNoteRequest",
              response: "Note",
              options: {
                "(google.api.http).post": "/v1/notes",
                "(google.api.http).body": "note",
                "(component).name": "Notes"
              }
            },
            GetNote: {
              request: "GetNoteRequest",
              response: "Note",
              options: {
                "(google.api.http).post": "/v1/notes/{id}/decrypt",
                "(google.api.http).body": "note",
                "(component).name": "Note"
              }
            }
          }
        }

        let result = [
          {
            type: 'service',
            files: [
              {
                filename: 'notes.service.ts',
                body: 'import { Injectable } from \'@angular/core\'\n\n\n@Injectable\nexport default class Notes {\n    constructor(http: Http) { }\n\n    createNote(request: CreateNoteRequest): Observable<Note> {\n        return this.http.post(`/v1/notes`, request.note)\n            .map(res => res.json())\n    }\n\n    getNote(request: GetNoteRequest): Observable<Note> {\n        return this.http.post(`/v1/notes/${request.id}/decrypt`, request.note)\n            .map(res => res.json())\n    }\n\n}\n'
              }
            ]
          },
          [
            {
              type: 'component',
              files: [
                { filename: 'notes/index.ts',
                  body: 'export * from \'./notes.component\';' },
                { filename: 'notes/notes.component.ts',
                  body: 'import { Component, OnInit } from \'@angular/core\';\nimport Notes from \'../notes.service\'\n\n@Component({\n  moduleId: module.id,\n  selector: \'notes\',\n  templateUrl: \'notes.component.html\',\n  styleUrls: [\'notes.component.css\'],\n  providers: [Notes]\n})\nexport class NotesComponent implements OnInit {\n    constructor(private notes: Notes) { }\n\n    ngOnInit() {\n        \n    }\n}' },
                { filename: 'notes/notes.component.html',
                  body: '<p>Notes {{ name }}</p>' },
                { filename: 'notes/notes.component.css', body: '' }
              ]
            },
            {
              type: 'component',
              files: [
                { filename: 'note/index.ts',
                  body: 'export * from \'./note.component\';' },
                { filename: 'note/note.component.ts',
                  body: 'import { Component, OnInit } from \'@angular/core\';\nimport Notes from \'../notes.service\'\n\n@Component({\n  moduleId: module.id,\n  selector: \'note\',\n  templateUrl: \'note.component.html\',\n  styleUrls: [\'note.component.css\'],\n  providers: [Notes]\n})\nexport class NoteComponent implements OnInit {\n    constructor(private notes: Notes) { }\n\n    ngOnInit() {\n        this.note = this.notes.getNote(id)\n    }\n}' },
                { filename: 'note/note.component.html',
                  body: '<p>Note {{ name }}</p>' },
                { filename: 'note/note.component.css', body: '' }
              ]
            }
          ]
        ]

        Service(serviceNode, ['rifl'])
          .then(x => {
            t.deepEqual(x, result)
            t.end()
          })
      })
    })
  })
})
