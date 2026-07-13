async function checkRedirect() {
  try {
    const res = await fetch('http://localhost:5000/', { redirect: 'manual' });
    console.log('Status:', res.status);
    console.log('Location:', res.headers.get('location'));
  } catch (err) {
    console.error('Error fetching:', err);
  }
}
checkRedirect();
