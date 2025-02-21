// Tokenomics için interaktif pasta grafiği
const ctx = document.getElementById('tokenomicsChart').getContext('2d');
const tokenomicsChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Community', 'Dev Wallet'],
        datasets: [{
            data: [90, 10], // %90 Community, %10 Dev Wallet
            backgroundColor: [
                '#4caf50', // Yeşil - Community
                '#f44336'  // Kırmızı - Dev Wallet
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