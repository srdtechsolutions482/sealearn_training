export const downloadSampleCourseExcel = () => {
    // Create CSV data
    const headers = [
        'S.No.',
        'Course Title',
        'Category',
        'Target Audience',
        'Entry Requirement',
        'Course Overview',
        'Additional Notes',
        'Validity',
        'Course Mode',
        'Seats per Batch',
        'City',
        'Start Date',
        'End Date',
        'Duration',
        'Instructor Name',
        'Course Fee',
        'Currency'
    ];

    const sampleData = [
        [
            '1',
            'Basic Safety Training',
            'Basic',
            'Officers, Ratings',
            'Valid Medical Certificate',
            'Comprehensive safety training for maritime professionals',
            'Bring ID and certification documents',
            '5 Years',
            'Online',
            '250',
            'N/A',
            '2025-01-15',
            '2025-01-20',
            '5 days',
            'John Smith',
            '5000',
            'USD'
        ],
        [
            '2',
            'Advanced Fire Fighting',
            'Advanced',
            'Officers',
            'Basic Safety Training completion',
            'Advanced fire fighting techniques and equipment handling',
            'Practical session required',
            '3 Years',
            'In-person',
            '25',
            'Mumbai',
            '2025-02-01',
            '2025-02-05',
            '4 days',
            'Jane Doe',
            '8000',
            'INR'
        ]
    ];

    // Convert to CSV
    const csvContent = [
        headers.join(','),
        ...sampleData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample-course-upload.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};
