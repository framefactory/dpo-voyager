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

import System from "@ff/graph/System";
import CComponent from "@ff/graph/Component";
import CSelection, { IComponentEvent } from "@ff/graph/components/CSelection";
import CDocumentManager from "@ff/graph/components/CDocumentManager";

import { customElement, html, property, PropertyValues } from "@ff/ui/CustomElement";
import List from "@ff/ui/List";
import "@ff/ui/Icon";

import CVItemManager, {
    IActiveItemEvent,
    IItemEvent
} from "../../explorer/components/CVItemManager";

import NVItem from "../../explorer/nodes/NVItem";


////////////////////////////////////////////////////////////////////////////////

@customElement("sv-item-list")
class ItemList extends List<NVItem>
{
    @property({ attribute: false })
    system: System = null;

    protected documentManager: CDocumentManager = null;
    protected itemManager: CVItemManager = null;
    protected selection: CSelection = null;

    protected firstConnected()
    {
        super.firstConnected();
        this.classList.add("sv-scrollable", "sv-item-list");

        this.documentManager = this.system.getMainComponent(CDocumentManager);
        this.itemManager = this.system.getMainComponent(CVItemManager);
        this.selection = this.system.getMainComponent(CSelection);
    }

    protected connected()
    {
        super.connected();

        this.selection.selectedComponents.on(CComponent, this.onSelectComponent, this);
        this.selection.selectedNodes.on(NVItem, this.onChange, this);

        this.itemManager.on<IItemEvent>("item", this.onChange, this);
        this.itemManager.on<IActiveItemEvent>("active-item", this.onChange, this);
    }

    protected disconnected()
    {
        this.selection.selectedComponents.off(CComponent, this.onSelectComponent, this);
        this.selection.selectedNodes.off(NVItem, this.onChange, this);

        this.itemManager.off<IActiveItemEvent>("active-item", this.onChange, this);
        this.itemManager.off<IItemEvent>("item", this.onChange, this);

        super.disconnected();
    }

    protected update(props: PropertyValues)
    {
        this.data = this.itemManager.items;
        return super.update(props);
    }

    protected renderItem(item: NVItem)
    {
        const isActive = item === this.itemManager.activeItem;
        return html`<div class="ff-flex-row"><ff-icon name=${isActive ? "check" : "empty"}></ff-icon>
            <ff-text class="ff-ellipsis">${item.displayName}</ff-text></div>`;
    }

    protected isItemSelected(item: NVItem): boolean
    {
        return this.selection.selectedNodes.contains(item)
            || this.selection.nodeContainsSelectedComponent(item);
    }

    protected onChange()
    {
        this.requestUpdate();
    }

    protected onSelectComponent(event: IComponentEvent)
    {
        if (event.object.node.is(NVItem)) {
            this.requestUpdate();
        }
    }

    protected onClickItem(event: MouseEvent, item: NVItem)
    {
        this.itemManager.activeItem = item;
    }
}