document.addEventListener('DOMContentLoaded', function() {
    const downloadLinks = document.querySelectorAll('a[download]');
    downloadLinks.forEach(link => {
        link.addEventListener('click', function() {
            alert('Oyun indirilmeye başlıyor...');
        });
    });
});