const bmiHistory = <%= JSON.stringify(bmiHistory) %> ; 

        const dates = bmiHistory.map(entry => entry.date);
        const bmis = bmiHistory.map(entry => entry.bmi);

        const ctx = document.getElementById('bmiChart').getContext('2d');
        const bmiChart = new Chart(ctx, {
        type: 'line',  // You can change this to 'bar' or 'pie' for other types of charts
        data: {
            labels: dates,  // X-axis (dates)
            datasets: [{
                label: 'BMI Over Time',
                data: bmis,  // Y-axis (BMI values)
                backgroundColor: '#97fb57',
                borderColor: '#97fb57',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'BMI'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            }
        }
    });