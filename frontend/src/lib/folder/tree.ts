import type { FileNode } from "@/lib/fs/types";

export function filterFileNodes(nodes: FileNode[], query: string): FileNode[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return nodes;
  }

  return nodes.flatMap((node) => {
    if (node.kind === "file") {
      return node.name.toLowerCase().includes(normalizedQuery) ||
        node.path.toLowerCase().includes(normalizedQuery)
        ? [node]
        : [];
    }

    const children = filterFileNodes(node.children ?? [], normalizedQuery);
    if (children.length > 0 || node.name.toLowerCase().includes(normalizedQuery)) {
      return [{ ...node, children }];
    }

    return [];
  });
}

export function countFileNodes(nodes: FileNode[]): number {
  return nodes.reduce((total, node) => {
    if (node.kind === "file") {
      return total + 1;
    }

    return total + countFileNodes(node.children ?? []);
  }, 0);
}
