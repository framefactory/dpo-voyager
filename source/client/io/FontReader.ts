/**
 * 3D Foundation Project
 * Copyright 2019 Smithsonian Institution
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

import {
    LoadingManager,
    TextureLoader,
    Texture,
} from "three";

import { Dictionary } from "@ff/core/types";

////////////////////////////////////////////////////////////////////////////////

export interface IBitmapFont
{
    descriptor: object;
    texture: Texture;
}

export default class FontReader
{
    private _loadingManager: LoadingManager;
    private _textureLoader: TextureLoader;
    private _cache: Dictionary<IBitmapFont>;

    constructor(loadingManager: LoadingManager)
    {
        this._loadingManager = loadingManager;
        this._textureLoader = new TextureLoader(loadingManager);
        this._cache = {};
    }

    get(url: string): IBitmapFont
    {
        return this._cache[url];
    }

    async load(url: string): Promise<IBitmapFont>
    {
        if (this._cache[url]) {
            return Promise.resolve(this._cache[url]);
        }

        this._loadingManager.itemStart(url);

        const descriptorUrl = url + ".json";
        const bitmapUrl = url + ".png";

        const loadDescriptor = fetch(descriptorUrl, {
            headers: {
                "Accept": "application/json"
            }
        }).then(result => {
            if (!result.ok) {
                this._loadingManager.itemError(url);
                throw new Error(`failed to load bitmap font descriptor: '${descriptorUrl}', status: ${result.status} ${result.statusText}`);
            }

            return result.json();
        });

        const loadBitmap = new Promise((resolve, reject) => {
            this._textureLoader.load(bitmapUrl, texture => {
                if (texture) {
                    return resolve(texture);
                }

                return reject(new Error(`failed to load font texture from '${bitmapUrl}'`));
            });
        });

        return Promise.all([ loadDescriptor, loadBitmap ])
            .then(result => {
                const font: IBitmapFont = {
                    descriptor: result[0] as object,
                    texture: result[1] as Texture,
                };
                this._cache[url] = font;
                this._loadingManager.itemEnd(url);
                return font;
            });
    }
}
