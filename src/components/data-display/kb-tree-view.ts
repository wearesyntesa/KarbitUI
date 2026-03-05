import { html, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize } from '../../core/types.js';
import { cx } from '../../utils/cx.js';
import { arrayHasChanged } from '../../utils/has-changed.js';

export interface TreeNode {
  readonly id: string;
  readonly label: string;
  readonly children?: readonly TreeNode[];
  readonly icon?: string;
  readonly disabled?: boolean;
}

interface FlatNode {
  readonly node: TreeNode;
  readonly depth: number;
  readonly isLast: boolean;
  readonly parentTrails: readonly boolean[];
}

const SIZE_ROW: Record<ComponentSize, string> = {
  xs: 'text-xs min-h-[28px]',
  sm: 'text-sm min-h-[32px]',
  md: 'text-sm min-h-[36px]',
  lg: 'text-base min-h-[44px]',
  xl: 'text-base min-h-[44px]',
} as const satisfies Record<ComponentSize, string>;

const SIZE_PY: Record<ComponentSize, string> = {
  xs: 'py-0.5',
  sm: 'py-1',
  md: 'py-1.5',
  lg: 'py-2',
  xl: 'py-2.5',
} as const satisfies Record<ComponentSize, string>;

const SIZE_PX: Record<ComponentSize, string> = {
  xs: 'px-1',
  sm: 'px-1.5',
  md: 'px-2',
  lg: 'px-2.5',
  xl: 'px-3',
} as const satisfies Record<ComponentSize, string>;

const INDENT_PX: Record<ComponentSize, number> = {
  xs: 16,
  sm: 18,
  md: 20,
  lg: 24,
  xl: 28,
} as const satisfies Record<ComponentSize, number>;

const ICON_SIZE: Record<ComponentSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-[18px] h-[18px]',
  xl: 'w-5 h-5',
} as const satisfies Record<ComponentSize, string>;

const CHEVRON_SIZE: Record<ComponentSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-3.5 h-3.5',
  lg: 'w-4 h-4',
  xl: 'w-4 h-4',
} as const satisfies Record<ComponentSize, string>;

function hasChildren(node: TreeNode): boolean {
  return (node.children?.length ?? 0) > 0;
}

function folderIconClosed(cls: string): TemplateResult {
  return html`<svg class=${cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
    <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
  </svg>`;
}

function folderIconOpen(cls: string): TemplateResult {
  return html`<svg class=${cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
    <path d="M5 19h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
    <path d="M3 13h18"/>
  </svg>`;
}

function fileIcon(cls: string): TemplateResult {
  return html`<svg class=${cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>`;
}

/**
 * Hierarchical tree view for displaying nested data structures.
 *
 * Supports expand/collapse, single-node selection, keyboard navigation,
 * optional indentation guide lines, and built-in folder/file icons.
 *
 * @fires kb-node-toggle - When a node is expanded or collapsed.
 * @fires kb-node-select - When a node is selected.
 *
 * @example
 * ```html
 * <kb-tree-view .nodes=${fileTree} show-icons></kb-tree-view>
 * ```
 */
export class KbTreeView extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Array of tree node data to render. */
  @property({ type: Array, hasChanged: arrayHasChanged })
  nodes: readonly TreeNode[] = [];

  /** IDs of nodes that should be expanded. */
  @property({ type: Array, attribute: 'expanded-ids', hasChanged: arrayHasChanged })
  'expanded-ids': string[] = [];

  /** ID of the currently selected node. */
  @property({ type: String, attribute: 'selected-id' })
  'selected-id': string = '';

  /** Controls text and padding sizing. @defaultValue 'md' */
  @property({ type: String })
  size: ComponentSize = 'md';

  /** Show indentation guide lines. @defaultValue false */
  @property({ type: Boolean, attribute: 'show-lines' })
  'show-lines': boolean = false;

  /** Show built-in folder/file icons. @defaultValue false */
  @property({ type: Boolean, attribute: 'show-icons' })
  'show-icons': boolean = false;

  /** Allow node selection. @defaultValue true */
  @property({ type: Boolean })
  selectable: boolean = true;

  @state()
  private _focusedId: string = '';

  @state()
  private _expandedSet: Set<string> = new Set();

  override willUpdate(changed: Map<PropertyKey, unknown>): void {
    super.willUpdate(changed);
    if (changed.has('expanded-ids')) {
      this._expandedSet = new Set(this['expanded-ids']);
    }
  }

  private _isExpanded(id: string): boolean {
    return this._expandedSet.has(id);
  }

  private _toggleNode(node: TreeNode): void {
    if (node.disabled || !hasChildren(node)) return;
    const expanded = !this._isExpanded(node.id);
    const next = new Set(this._expandedSet);
    if (expanded) {
      next.add(node.id);
    } else {
      next.delete(node.id);
    }
    this._expandedSet = next;
    this['expanded-ids'] = [...next];
    this.emit('kb-node-toggle', { id: node.id, expanded });
  }

  private _selectNode(node: TreeNode): void {
    if (node.disabled || !this.selectable) return;
    this['selected-id'] = node.id;
    this.emit('kb-node-select', { id: node.id, label: node.label });
  }

  private _flattenVisible(nodes: readonly TreeNode[], depth: number, parentTrails: readonly boolean[]): FlatNode[] {
    const result: FlatNode[] = [];
    const len = nodes.length;
    for (let i = 0; i < len; i++) {
      const node = nodes[i] as TreeNode;
      const isLast = i === len - 1;
      result.push({ node, depth, isLast, parentTrails });
      if (hasChildren(node) && this._isExpanded(node.id)) {
        const childTrails = [...parentTrails, !isLast];
        result.push(...this._flattenVisible(node.children ?? [], depth + 1, childTrails));
      }
    }
    return result;
  }

  private _findNodeById(id: string, nodes: readonly TreeNode[]): TreeNode | undefined {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (hasChildren(node)) {
        const found = this._findNodeById(id, node.children ?? []);
        if (found) return found;
      }
    }
    return undefined;
  }

  private _findParentOf(id: string, nodes: readonly TreeNode[]): TreeNode | undefined {
    for (const node of nodes) {
      if (node.children) {
        for (const child of node.children) {
          if (child.id === id) return node;
        }
        const found = this._findParentOf(id, node.children);
        if (found) return found;
      }
    }
    return undefined;
  }

  private _keyArrowDown(flatList: FlatNode[], currentIndex: number): void {
    const ni = currentIndex < flatList.length - 1 ? currentIndex + 1 : 0;
    const next = flatList[ni];
    if (next) this._focusedId = next.node.id;
  }

  private _keyArrowUp(flatList: FlatNode[], currentIndex: number): void {
    const pi = currentIndex > 0 ? currentIndex - 1 : flatList.length - 1;
    const prev = flatList[pi];
    if (prev) this._focusedId = prev.node.id;
  }

  private _keyArrowRight(): void {
    const cur = this._findNodeById(this._focusedId, this.nodes);
    if (cur && hasChildren(cur) && !this._isExpanded(cur.id) && !cur.disabled) {
      this._toggleNode(cur);
    }
  }

  private _keyArrowLeft(): void {
    const cur = this._findNodeById(this._focusedId, this.nodes);
    if (!cur) return;
    if (hasChildren(cur) && this._isExpanded(cur.id) && !cur.disabled) {
      this._toggleNode(cur);
      return;
    }
    const parent = this._findParentOf(this._focusedId, this.nodes);
    if (parent) this._focusedId = parent.id;
  }

  private _keyActivate(): void {
    const cur = this._findNodeById(this._focusedId, this.nodes);
    if (!cur) return;
    if (hasChildren(cur)) this._toggleNode(cur);
    this._selectNode(cur);
  }

  private _handleKeyDown(e: KeyboardEvent): void {
    const flatList = this._flattenVisible(this.nodes, 0, []);
    if (flatList.length === 0) return;
    const currentIndex = flatList.findIndex((f) => f.node.id === this._focusedId);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this._keyArrowDown(flatList, currentIndex);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this._keyArrowUp(flatList, currentIndex);
        break;
      case 'ArrowRight':
        e.preventDefault();
        this._keyArrowRight();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this._keyArrowLeft();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        this._keyActivate();
        break;
      default:
        /* unhandled key */
        return;
    }
  }

  private _onRowClick(node: TreeNode): void {
    this._focusedId = node.id;
    if (hasChildren(node)) {
      this._toggleNode(node);
    }
    this._selectNode(node);
  }

  private _onRowKeyDown(e: KeyboardEvent, node: TreeNode): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      this._focusedId = node.id;
      if (hasChildren(node)) {
        this._toggleNode(node);
      }
      this._selectNode(node);
    }
  }

  private _renderDepthGuides(flat: FlatNode): TemplateResult | typeof nothing {
    if (!this['show-lines'] || flat.depth === 0) return nothing;
    const indent = INDENT_PX[this.size];
    const guides: TemplateResult[] = [];
    for (let d = 0; d < flat.depth; d++) {
      const hasTrail = flat.parentTrails[d];
      if (!hasTrail && d < flat.depth - 1) continue;
      const leftPx = d * indent + indent / 2;
      const isCurrentDepth = d === flat.depth - 1;
      let guideClass: string;
      if (isCurrentDepth && flat.isLast) {
        guideClass = 'absolute top-0 h-1/2 border-l border-gray-200 dark:border-zinc-700';
      } else if (hasTrail || isCurrentDepth) {
        guideClass = 'absolute top-0 bottom-0 border-l border-gray-200 dark:border-zinc-700';
      } else {
        continue;
      }
      guides.push(html`<span class=${guideClass} style="left:${leftPx}px" aria-hidden="true"></span>`);
      if (isCurrentDepth) {
        const hLineTop = '50%';
        const hLineWidth = `${indent / 2 - 2}px`;
        guides.push(
          html`<span
            class="absolute border-t border-gray-200 dark:border-zinc-700"
            style="left:${leftPx}px;top:${hLineTop};width:${hLineWidth}"
            aria-hidden="true"
          ></span>`,
        );
      }
    }
    return html`${guides}`;
  }

  private _renderNodeIcon(node: TreeNode, expanded: boolean): TemplateResult | typeof nothing {
    if (!this['show-icons']) return nothing;
    const cls = cx(ICON_SIZE[this.size], 'shrink-0', kbClasses.textSecondary);
    if (hasChildren(node)) {
      return expanded ? folderIconOpen(cls) : folderIconClosed(cls);
    }
    return fileIcon(cls);
  }

  private _renderChevron(node: TreeNode, expanded: boolean): TemplateResult {
    const isBranch = hasChildren(node);
    const chevCls = cx(
      CHEVRON_SIZE[this.size],
      'shrink-0 transition-transform duration-100',
      isBranch ? '' : 'invisible',
      expanded ? 'rotate-90' : '',
    );
    return html`<span class="inline-flex items-center justify-center shrink-0 w-5 h-5" aria-hidden="true">
      <svg class=${chevCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
    </span>`;
  }

  private _renderRow(flat: FlatNode): TemplateResult {
    const { node, depth } = flat;
    const isBranch = hasChildren(node);
    const expanded = this._isExpanded(node.id);
    const isSelected = this['selected-id'] === node.id;
    const isFocused = this._focusedId === node.id;
    const indent = INDENT_PX[this.size];

    let selectedCls: string;
    if (isSelected) {
      selectedCls = 'border-l-2 border-l-blue-500 dark:border-l-blue-400 bg-blue-50/50 dark:bg-blue-950/20';
    } else {
      selectedCls = 'border-l-2 border-l-transparent';
    }

    let hoverCls: string;
    if (node.disabled) {
      hoverCls = kbClasses.disabledLook;
    } else {
      hoverCls = 'hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer';
    }

    const focusCls = isFocused ? 'outline outline-2 outline-blue-500 -outline-offset-2' : '';

    const rowClasses = cx(
      'relative flex items-center gap-1 select-none',
      SIZE_ROW[this.size],
      SIZE_PY[this.size],
      SIZE_PX[this.size],
      kbClasses.textPrimary,
      kbClasses.transitionColors,
      selectedCls,
      hoverCls,
      focusCls,
    );

    const ariaExpanded = isBranch ? String(expanded) : nothing;
    const ariaDisabled = node.disabled ? 'true' : nothing;

    return html`
      <div
        role="treeitem"
        aria-expanded=${ariaExpanded}
        aria-selected=${isSelected ? 'true' : 'false'}
        aria-disabled=${ariaDisabled}
        data-node-id=${node.id}
        class=${rowClasses}
        style="padding-left:${depth * indent + 4}px"
        @click=${(): void => this._onRowClick(node)}
        @keydown=${(e: KeyboardEvent): void => this._onRowKeyDown(e, node)}
        tabindex=${isFocused ? '0' : '-1'}
      >
        ${this._renderDepthGuides(flat)}
        ${this._renderChevron(node, expanded)}
        ${this._renderNodeIcon(node, expanded)}
        ${node.icon ? html`<span class="shrink-0">${node.icon}</span>` : nothing}
        <span class="truncate font-sans">${node.label}</span>
      </div>
    `;
  }

  override render(): TemplateResult {
    const flatList = this._flattenVisible(this.nodes, 0, []);
    const containerClasses = this.buildClasses(kbClasses.surface, kbClasses.border, 'font-sans overflow-hidden');

    return html`
      <div
        class=${containerClasses}
        role="tree"
        tabindex="0"
        @keydown=${(e: KeyboardEvent): void => this._handleKeyDown(e)}
        @focus=${(): void => this._onTreeFocus()}
      >
        ${flatList.map((flat) => this._renderRow(flat))}
      </div>
    `;
  }

  private _onTreeFocus(): void {
    if (this._focusedId) return;
    const flatList = this._flattenVisible(this.nodes, 0, []);
    const first = flatList[0];
    if (first) {
      this._focusedId = first.node.id;
    }
  }

  /** Expand all branch nodes. */
  expandAll(): void {
    const ids: string[] = [];
    const collect = (nodes: readonly TreeNode[]): void => {
      for (const node of nodes) {
        if (hasChildren(node)) {
          ids.push(node.id);
          collect(node.children ?? []);
        }
      }
    };
    collect(this.nodes);
    this._expandedSet = new Set(ids);
    this['expanded-ids'] = ids;
  }

  /** Collapse all branch nodes. */
  collapseAll(): void {
    this._expandedSet = new Set();
    this['expanded-ids'] = [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-tree-view': KbTreeView;
  }
}
