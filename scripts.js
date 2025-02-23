// Tokenomics için interaktif pasta grafiği
const ctx = document.getElementById('tokenomicsChart').getContext('2d');
const tokenomicsChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: [
            'Free Market',              // Serbest Piyasa
            'Emergency Fund',          // Acil Durum Fonu
            'Development Team Costs',  // Geliştirme Ekip Giderleri
            'Marketing & Listing',     // Pazarlama ve Listeleme Giderleri
            'Dev Share',          // Yaratıcı Payı
            'Community Reward Pool'    // Topluluk Ödül Havuzu
        ],
        datasets: [{
            data: [90, 1, 2, 3, 2, 2],
            backgroundColor: [
                '#4caf50', // Free Market - Yeşil
                '#ff9800', // Emergency Fund - Turuncu
                '#2196f3', // Development Team Costs - Mavi
                '#9c27b0', // Marketing & Listing - Mor
                '#f44336', // Creative Share - Kırmızı
                '#ffeb3b'  // Community Reward Pool - Sarı
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += context.raw + '%';
                        return label;
                    }
                }
            }
        }
    }
});

// Bölümlere yumuşak kaydırma fonksiyonu
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth' });
}

// Progress Bar Güncelleme Fonksiyonu
function updateProgress(solAmount) {
    const maxSol = 5; // Hedef 5 SOL
    const percentage = (solAmount / maxSol) * 100;
    document.querySelector('.progress-fill').style.width = `${percentage}%`;
    document.getElementById('current-sol').textContent = solAmount;
}

// Başlangıç değeri: 0 SOL
updateProgress(0);