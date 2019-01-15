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

import parseUrlParameter from "@ff/browser/parseUrlParameter";

import Commander from "@ff/core/Commander";
import Registry from "@ff/graph/Registry";
import System from "@ff/graph/System";

import CPulse from "@ff/graph/components/CPulse";

import CRenderer from "@ff/scene/components/CRenderer";
import CPickSelection from "@ff/scene/components/CPickSelection";
import CLoadingManager from "../core/components/CLoadingManager";
import CExplorer from "./components/CExplorer";
import CPresentations from "./components/CPresentations";

import { componentTypes as graphComponents } from "@ff/graph/components";
import { componentTypes as sceneComponents } from "@ff/scene/components";
import { componentTypes as voyagerComponents } from "../core/components";
import { componentTypes as explorerComponents } from "./components";

import MainView from "./ui/MainView";

////////////////////////////////////////////////////////////////////////////////

/**
 * Initial properties of the Voyager Explorer main [[ExplorerApplication]].
 */
export interface IExplorerApplicationProps
{
    /** URL of the presentation to load and display at startup. */
    presentation?: string;
    /** If an item, model or geometry URL is given, optional URL of a presentation template to use with the item. */
    template?: string;
    /** URL of the item to load and display at startup. */
    item?: string;
    /** URL of a model (supported formats: gltf, glb) to load and display at startup. */
    model?: string;
    /** URL of a geometry (supported formats: obj, ply) to load and display at startup. */
    geometry?: string;
    /** If a geometry URL is given, optional URL of a color texture to use with the geometry. */
    texture?: string;
    /** When loading a model or geometry, the quality level to set for the asset.
        Valid options: "thumb", "low", "medium", "high". */
    quality?: string;
    /** When loading a model or geometry, the name of the created item. */
    name?: string;
}

/**
 * Voyager Explorer main application.
 */
export default class ExplorerApplication
{
    protected static splashMessage = [
        "Voyager - 3D Explorer and Tool Suite",
        "3D Foundation Project",
        "(c) 2018 Smithsonian Institution",
        "https://3d.si.edu"
    ].join("\n");

    readonly props: IExplorerApplicationProps;
    readonly system: System;
    readonly commander: Commander;


    constructor(element?: HTMLElement, props?: IExplorerApplicationProps)
    {
        console.log(ExplorerApplication.splashMessage);

        // register components
        const registry = new Registry();
        registry.registerComponentType(graphComponents);
        registry.registerComponentType(sceneComponents);
        registry.registerComponentType(voyagerComponents);
        registry.registerComponentType(explorerComponents);

        this.commander = new Commander();
        const system = this.system = new System(registry);

        const node = system.graph.createNode("Explorer");
        const pulse = node.createComponent(CPulse);
        node.createComponent(CRenderer);
        node.createComponent(CExplorer);
        node.createComponent(CLoadingManager);
        node.createComponent(CPickSelection).createActions(this.commander);
        node.createComponent(CPresentations).createActions(this.commander);

        // create main view if not given
        if (element) {
            new MainView(this).appendTo(element);
        }

        // start rendering
        pulse.start();

        // start loading from properties
        this.props = this.initFromProps(props);
    }

    protected initFromProps(props: IExplorerApplicationProps): IExplorerApplicationProps
    {
        const presentationController = this.system.components.safeGet(CPresentations);

        props.presentation = props.presentation || parseUrlParameter("presentation") || parseUrlParameter("p");
        props.item = props.item || parseUrlParameter("item") || parseUrlParameter("i");
        props.template = props.template || parseUrlParameter("template") || parseUrlParameter("t");
        props.model = props.model || parseUrlParameter("model") || parseUrlParameter("m");
        props.geometry = props.geometry || parseUrlParameter("geometry") || parseUrlParameter("g");
        props.texture = props.texture || parseUrlParameter("texture") || parseUrlParameter("tex");
        props.quality = props.quality || parseUrlParameter("quality") || parseUrlParameter("q");
        props.name = props.name || parseUrlParameter("name") || parseUrlParameter("n");

        if (props.presentation) {
            presentationController.loadPresentation(props.presentation);
        }
        else if (props.item) {
            presentationController.loadItem(props.item, props.template);
        }
        else if (props.model) {
            presentationController.loadModel(props.model, props.quality, props.name, props.template);
        }
        else if (props.geometry) {
            presentationController.loadGeometryAndTexture(
                props.geometry, props.texture, props.quality, props.name, props.template);
        }

        return props;
    }
}

window["VoyagerExplorer"] = ExplorerApplication;