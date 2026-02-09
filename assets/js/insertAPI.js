export function initInsertProduct() {
  const form = document.getElementById('form-grid');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
  
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
     console.log('server response:', data);
      if (response.ok) {
        alert('Insert success');
        form.reset();
      } else {
        alert(data.error || 'Insert failed');
      }
    } catch (err) {
      console.error(err);
    }
  });
}
