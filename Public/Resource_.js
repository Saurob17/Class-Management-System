function toggleSection(header) {
    const section = header.closest('.section');
    const ul = header.nextElementSibling;
    const icon = header.querySelector('.toggle-icon');
    // Toggle active class
    section.classList.toggle('active');
    // Add click animation
    header.style.transform = 'scale(0.98)';
    setTimeout(() => {
        header.style.transform = 'scale(1)';
    }, 150);
}

// Add hover effects for sections

document.querySelectorAll('.section').forEach(section => {
    section.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    section.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add loading animation
window.addEventListener('load', function() {
    document.querySelectorAll('.section').forEach((section, index) => {
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 100);
    });
});
