export const findNode = (nodes, id) => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const deleteNode = (nodes, id) => {
  return nodes.filter(node => {
    if (node.id === id) return false;
    if (node.children) return { ...node, children: deleteNode(node.children, id) };
    return true;
  }).map(node => {
    if (node.children) return { ...node, children: deleteNode(node.children, id) };
    return node;
  });
};

export const updateNode = (nodes, id, updates) => {
  return nodes.map(node => {
    if (node.id === id) return { ...node, ...updates };
    if (node.children) return { ...node, children: updateNode(node.children, id, updates) };
    return node;
  });
};

export const insertNode = (nodes, parentId, newNode, index = -1) => {
  return nodes.map(node => {
    if (node.id === parentId) {
      const children = [...(node.children || [])];
      if (index === -1) children.push(newNode);
      else children.splice(index, 0, newNode);
      return { ...node, children };
    }
    if (node.children) return { ...node, children: insertNode(node.children, parentId, newNode, index) };
    return node;
  });
};

export const removeAndGetNode = (nodes, id, result = { node: null }) => {
  const filtered = nodes.filter(node => {
    if (node.id === id) {
      result.node = node;
      return false;
    }
    return true;
  });
  
  return filtered.map(node => {
    if (node.children) {
      return { ...node, children: removeAndGetNode(node.children, id, result) };
    }
    return node;
  });
};
