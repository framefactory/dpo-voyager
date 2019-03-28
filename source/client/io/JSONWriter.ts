/**
 * 3D Foundation Project
 * Copyright 2018 Smithsonian Institution
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as THREE from "three";

import fetch from "@ff/browser/fetch";

////////////////////////////////////////////////////////////////////////////////

export default class JSONWriter
{
    private _loadingManager: THREE.LoadingManager;

    constructor(loadingManager: THREE.LoadingManager)
    {
        this._loadingManager = loadingManager;
    }

    put(json: any, url: string): Promise<void>
    {
        this._loadingManager.itemStart(url);

        return fetch.json(url, "PUT", json).then(() => {
            this._loadingManager.itemEnd(url);
        }).catch(error => {
            this._loadingManager.itemError(url);
            throw error;
        });
    }
}