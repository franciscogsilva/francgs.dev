import { visit } from 'unist-util-visit';
import { h } from 'hastscript';

/**
 * Remark plugin to transform directive nodes into callout HTML
 * Supports syntax: :::note, :::tip, :::important, :::warning, :::caution
 */
export function remarkCallouts() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        if (node.type !== 'containerDirective') return;

        const calloutTypes = ['note', 'tip', 'important', 'warning', 'caution'];
        
        if (!calloutTypes.includes(node.name)) return;

        const data = node.data || (node.data = {});
        const tagName = 'div';

        data.hName = tagName;
        data.hProperties = h(tagName, {
          class: `callout callout-${node.name}`,
        }).properties;
      }
    });
  };
}
