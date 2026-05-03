import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root, Text } from "mdast";

/**
 * Wandelt Obsidian-style [[Note Name]] in normale markdown-Links um.
 * Slug = lowercase + spaces → hyphens. Behält den display name als Link-Text.
 *
 * Bsp.: [[Microsoft Agent Framework]] → [Microsoft Agent Framework](/products/microsoft-agent-framework)
 *       [[deprecated/Bot Framework]]   → [Bot Framework](/products/deprecated-bot-framework)
 */
export const remarkWikilinks: Plugin<[], Root> = () => (tree) => {
  visit(tree, "text", (node: Text, index, parent) => {
    if (!parent || index === undefined) return;
    const value = node.value;
    const re = /\[\[([^\]]+)\]\]/g;
    if (!re.test(value)) return;

    re.lastIndex = 0;
    const newChildren: any[] = [];
    let lastEnd = 0;
    let match: RegExpExecArray | null;

    while ((match = re.exec(value)) !== null) {
      if (match.index > lastEnd) {
        newChildren.push({ type: "text", value: value.slice(lastEnd, match.index) });
      }
      const target = match[1];
      const display = target.replace(/^deprecated\//, "");
      const slug = target.toLowerCase().replace(/[\s/]+/g, "-").replace(/[^a-z0-9-]/g, "");
      newChildren.push({
        type: "link",
        url: `/products/${slug}`,
        children: [{ type: "text", value: display }],
      });
      lastEnd = re.lastIndex;
    }
    if (lastEnd < value.length) {
      newChildren.push({ type: "text", value: value.slice(lastEnd) });
    }

    parent.children.splice(index, 1, ...newChildren);
    return index + newChildren.length;
  });
};
