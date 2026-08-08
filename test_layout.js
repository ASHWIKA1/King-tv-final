fetch('http://localhost:8080/api/v1/layout/web')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
