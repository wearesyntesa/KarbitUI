import { cloneVNode, isVNode, type Slots, type VNode } from 'vue';

function readSlotNodes(slots: Slots, slotName: string): readonly VNode[] {
  const slot = slots[slotName];
  if (!slot) return [];

  return slot().filter(isVNode);
}

export function renderElementSlotChildren(slots: Slots, namedSlotNames: readonly string[] = []): VNode[] {
  const children = [...readSlotNodes(slots, 'default')];

  for (const slotName of namedSlotNames) {
    const nodes = readSlotNodes(slots, slotName);
    for (const node of nodes) {
      children.push(cloneVNode(node, { slot: slotName }));
    }
  }

  return children;
}
