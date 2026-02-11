const RELATED_MARKERS = new Set(["related", "related:", "relacionados", "relacionados:"]);

const getNodeText = (node) => {
  if (!node) return "";
  if (node.type === "text") return node.value ?? "";
  if (!Array.isArray(node.children)) return "";
  return node.children.map(getNodeText).join("");
};

const isRelatedMarkerNode = (node) => {
  if (!node) return false;
  if (node.type !== "paragraph" && node.type !== "heading") return false;
  const text = getNodeText(node).trim().toLowerCase();
  return RELATED_MARKERS.has(text);
};

const isPlainUrlParagraph = (node) => {
  if (!node || node.type !== "paragraph") return false;
  const text = getNodeText(node).trim();
  return /^(https?:\/\/\S+|\/\S+)$/i.test(text);
};

const isUrlOnlyList = (node) => {
  if (!node || node.type !== "list" || !Array.isArray(node.children)) return false;
  if (node.children.length === 0) return false;

  return node.children.every((item) => {
    if (!item || item.type !== "listItem" || !Array.isArray(item.children)) return false;
    if (item.children.length !== 1) return false;
    return isPlainUrlParagraph(item.children[0]);
  });
};

export function remarkStripRelatedLinks() {
  return (tree) => {
    if (!Array.isArray(tree.children)) return;

    for (let index = 0; index < tree.children.length; index += 1) {
      if (!isRelatedMarkerNode(tree.children[index])) continue;

      let end = index + 1;
      while (end < tree.children.length) {
        const current = tree.children[end];
        if (!isPlainUrlParagraph(current) && !isUrlOnlyList(current)) {
          break;
        }
        end += 1;
      }

      tree.children.splice(index, end - index);
      index -= 1;
    }
  };
}
