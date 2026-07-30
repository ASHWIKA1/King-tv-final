import re

with open('admin/src/pages/journalist/PostEditor.jsx', 'r') as f:
    content = f.read()

# 1. Rename Component
content = content.replace('const NewsEditor = () =>', 'const PostEditor = () =>')
content = content.replace('export default NewsEditor', 'export default PostEditor')

# 2. Fix Endpoints & Navigation
content = content.replace("await api.put(`/articles/${id}`, payload);", "await api.put('/articles/saveUpdate', { ...payload, id: parseInt(id) });")
content = content.replace("await api.post('/articles', payload);", "await api.post('/articles/saveUpdate', payload);")

content = content.replace("navigate('/admin/news')", "navigate('/journalist/posts')")
content = content.replace("navigate(`/admin/news/${res.data.id}/edit`)", "navigate(`/journalist/edit/${res.data.id}`)")

# 3. Disable Reporter/Admin fetch that might 403
content = re.sub(r'api\.get\(\'/users/reporters\'\).*?;', '', content, flags=re.DOTALL)
content = re.sub(r'api\.get\(\'/districts\'\).*?;', '', content, flags=re.DOTALL)

with open('admin/src/pages/journalist/PostEditor.jsx', 'w') as f:
    f.write(content)

