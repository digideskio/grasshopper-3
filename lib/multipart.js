/*
 * Copyright (C) 2010 Chandra Sekar S
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var fs = require('fs'),
    sys = require('sys'),
    uuid = require('uuid'),
    formidable = require('./support/node-formidable/lib/formidable/formidable');

var maxPostSize = undefined,
    uploadsDir = '/tmp';

exports.configure = function(config) {
    if(config.maxPostSize)
        maxPostSize = config.maxPostSize;
    if(config.uploadsDir)
        uploadsDir = config.uploadsDir;
};

exports.parse = function(context, callback) {
    context.params = {};
    var req = context.request;
    if(new Number(req.headers['content-length']) > maxPostSize) {
        context.handleError(new Error('LARGE_UPLOAD'));
        return;
    }

    var form = new formidable.IncomingForm();
    form.uploadDir = uploadsDir;
    form.parse(req, function(err, fields, files) {
        if(err) {
            context.handleError(err);
        } else {
            for(var i in fields) {
                context.params[i] = fields[i]
            }

            for(var i in files) {
                context.params[i] = files[i];
            }
            callback();
        }
    });
};
